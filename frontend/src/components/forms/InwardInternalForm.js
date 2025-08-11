import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const InwardInternalForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [departments, setDepartments] = useState([
        { label: 'Production', value: 'Production' },
        { label: 'Assembly', value: 'Assembly' },
        { label: 'Quality Control', value: 'Quality Control' },
        { label: 'R&D', value: 'R&D' }
    ]);
    const [allItems, setAllItems] = useState([]);
    const [productionFloorItems, setProductionFloorItems] = useState([]);
    const [productionFloorStocks, setProductionFloorStocks] = useState([]);
    const [recentEntries, setRecentEntries] = useState([]);
    const [receiptNo, setReceiptNo] = useState('');
    const [receivedDate, setReceivedDate] = useState('');
    const [receivedBy, setReceivedBy] = useState('');
    const [department, setDepartment] = useState('');
    const [finishGoods, setFinishGoods] = useState([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '' }]);
    const [materialUsed, setMaterialUsed] = useState([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '', availableStock: 0 }]);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [modal, setModal] = useState({ 
        show: false, 
        title: '', 
        message: '', 
        type: 'info',
        showConfirmButton: false, 
        onConfirm: null,
        onClose: null,
        autoClose: false,
        autoCloseDelay: 3000
    });

    const generateReceiptNumber = useCallback(async () => {
        try {
            console.log('Attempting to generate receipt number...');
            const response = await fetch(`${API_BASE_URL}/inward-internals/generate-receipt-number`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Received receipt number data:', data);
            setReceiptNo(data.receiptNumber);
        } catch (error) {
            console.error("Error generating receipt number:", error);
            setModal({ 
                show: true, 
                title: "❌ Generation Failed", 
                message: "Failed to generate receipt number. Please try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    }, [API_BASE_URL]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [allItemsResponse, productionFloorResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/items`),
                fetch(`${API_BASE_URL}/production-floor-stocks`)
            ]);

            if (!allItemsResponse.ok || !productionFloorResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const allItemsData = await allItemsResponse.json();
            const productionFloorData = await productionFloorResponse.json();

            const finishedGoodsItems = allItemsData
                .filter(i => i.category_name === 'Finish Good')
                .map(i => ({ 
                    id: i.id, 
                    label: `${i.item_name} - ${i.full_description}`, 
                    value: i.id, 
                    unitRate: parseFloat(i.unit_rate), 
                    itemCode: i.item_code,
                    description: i.full_description,
                    categoryName: i.category_name,
                    uom: i.uom || 'PC'
                }));

            const rawMaterialItems = allItemsData
                .filter(i => i.category_name === 'Raw Material')
                .map(i => ({ 
                    id: i.id, 
                    label: `${i.item_name} - ${i.full_description}`, 
                    value: i.id, 
                    unitRate: parseFloat(i.unit_rate), 
                    itemCode: i.item_code,
                    description: i.full_description,
                    categoryName: i.category_name,
                    uom: i.uom || 'PC'
                }));

            setAllItems(finishedGoodsItems);
            setProductionFloorItems(rawMaterialItems);
            setProductionFloorStocks(productionFloorData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setModal({ 
                show: true, 
                title: "⚠️ Data Loading Error", 
                message: "Failed to load data. Please refresh the page and try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    const fetchRecentEntries = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/inward-internals`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setRecentEntries(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching recent entries:", error);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
        fetchRecentEntries();
    }, [fetchData, fetchRecentEntries]);

    useEffect(() => {
        if (!editingEntryId && !receiptNo) {
            generateReceiptNumber();
        }
    }, [editingEntryId, receiptNo, generateReceiptNumber]);

    const handleFinishGoodsChange = (index, field, value) => {
        const updatedItems = [...finishGoods];
        updatedItems[index][field] = value;

        if (field === 'itemId') {
            const selectedItem = allItems.find(i => parseInt(i.value) === parseInt(value));
            if (selectedItem) {
                updatedItems[index].unitRate = selectedItem.unitRate || 0;
                updatedItems[index].uom = selectedItem.uom || 'PC';
            } else {
                updatedItems[index].uom = 'PC';
                updatedItems[index].unitRate = 0;
            }
        }
        setFinishGoods(updatedItems);
    };

    const handleMaterialUsedChange = (index, field, value) => {
        const updatedItems = [...materialUsed];
        updatedItems[index][field] = value;

        if (field === 'itemId') {
            const selectedItem = productionFloorItems.find(i => parseInt(i.value) === parseInt(value));
            if (selectedItem) {
                updatedItems[index].unitRate = selectedItem.unitRate || 0;
                updatedItems[index].uom = selectedItem.uom || 'PC';
                
                const stockInfo = productionFloorStocks.find(s => parseInt(s.item_id) === parseInt(value));
                updatedItems[index].availableStock = stockInfo ? stockInfo.quantity : 0;
            } else {
                updatedItems[index].uom = 'PC';
                updatedItems[index].unitRate = 0;
                updatedItems[index].availableStock = 0;
            }
        }
        setMaterialUsed(updatedItems);
    };

    const addFinishGoodsRow = () => {
        setFinishGoods([...finishGoods, { itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '' }]);
    };

    const removeFinishGoodsRow = (index) => {
        if (finishGoods.length > 1) {
            setFinishGoods(finishGoods.filter((_, i) => i !== index));
        }
    };

    const addMaterialUsedRow = () => {
        setMaterialUsed([...materialUsed, { itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '', availableStock: 0 }]);
    };

    const removeMaterialUsedRow = (index) => {
        if (materialUsed.length > 1) {
            setMaterialUsed(materialUsed.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setReceiptNo('');
        setReceivedDate('');
        setReceivedBy('');
        setDepartment('');
        setFinishGoods([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '' }]);
        setMaterialUsed([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '', availableStock: 0 }]);
        setEditingEntryId(null);
    };

    const validateStock = () => {
        for (let item of materialUsed) {
            if (Number(item.qty) > item.availableStock) {
                const selectedItem = productionFloorItems.find(i => parseInt(i.value) === parseInt(item.itemId));
                setModal({ 
                    show: true, 
                    title: "⚠️ Insufficient Stock Alert", 
                    message: `${selectedItem?.label || 'Selected item'} has only ${item.availableStock} units available in production floor, but you're trying to use ${item.qty} units.\n\nPlease adjust the quantity to proceed.`, 
                    type: 'warning',
                    showConfirmButton: false,
                    autoClose: false,
                    onClose: () => setModal(prev => ({ ...prev, show: false }))
                });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!receiptNo || !receivedDate || !receivedBy || !department) {
            setModal({ 
                show: true, 
                title: "❌ Validation Error", 
                message: "Please fill in all required fields:\n• Receipt Number\n• Received Date\n• Received By\n• Department", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        if (finishGoods.length === 0 && materialUsed.length === 0) {
            setModal({ 
                show: true, 
                title: "❌ Items Required", 
                message: "Please add at least one item in either:\n• Finished Goods section\n• Material Used section", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        if (!validateStock()) {
            return;
        }

        const inwardData = {
            receiptNo,
            receivedDate,
            receivedBy,
            department,
            finishGoods: finishGoods.filter(item => item.itemId).map(item => ({
                itemId: item.itemId,
                unitRate: item.unitRate,
                uom: item.uom,
                qty: item.qty,
                remark: item.remark
            })),
            materialUsed: materialUsed.filter(item => item.itemId).map(item => ({
                itemId: item.itemId,
                unitRate: item.unitRate,
                uom: item.uom,
                qty: item.qty,
                remark: item.remark
            })),
            userId
        };

        try {
            let response;
            if (editingEntryId) {
                response = await fetch(`${API_BASE_URL}/inward-internals/${editingEntryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inwardData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/inward-internals`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inwardData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setModal({ 
                show: true, 
                title: "🎉 Production Completed!", 
                message: `Inward Internal ${receiptNo} ${editingEntryId ? 'updated' : 'completed'} successfully!\n\n✅ Finished goods added to inventory\n📦 Materials consumed from production floor`, 
                type: 'success',
                showConfirmButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchRecentEntries();
                    if (!editingEntryId) {
                        generateReceiptNumber();
                    }
                }
            });
        } catch (error) {
            console.error("Error saving inward internal:", error);
            setModal({ 
                show: true, 
                title: "❌ Operation Failed", 
                message: `Failed to save production data.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const handleDelete = (entryId, receiptNo) => {
        setModal({
            show: true,
            title: "🗑️ Confirm Production Entry Deletion",
            message: `Are you sure you want to delete Production Entry ${receiptNo}?\n\n⚠️ This action will:\n• Permanently remove the production entry\n• Reverse all stock movements\n• Cannot be undone\n\nProceed with deletion?`,
            type: 'warning',
            showConfirmButton: true,
            autoClose: false,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/inward-internals/${entryId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "✅ Production Entry Deleted", 
                        message: `Production entry ${receiptNo} has been successfully deleted.\n\n🔄 All stock movements have been reversed\n📊 Inventory levels have been restored`, 
                        type: 'success',
                        showConfirmButton: false,
                        autoClose: true,
                        autoCloseDelay: 3000,
                        onClose: () => {
                            setModal(prev => ({ ...prev, show: false }));
                            fetchRecentEntries();
                        }
                    });
                } catch (error) {
                    console.error("Error deleting inward internal:", error);
                    setModal({ 
                        show: true, 
                        title: "❌ Deletion Failed", 
                        message: `Failed to delete production entry ${receiptNo}.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
                        type: 'error',
                        showConfirmButton: false,
                        autoClose: false,
                        onClose: () => setModal(prev => ({ ...prev, show: false }))
                    });
                }
            },
            onClose: () => setModal(prev => ({ ...prev, show: false }))
        });
    };

    const handleEdit = async (entry) => {
        try {
            const response = await fetch(`${API_BASE_URL}/inward-internals/${entry.id}`);
            if (!response.ok) throw new Error('Failed to fetch entry details');
            
            const entryData = await response.json();
            
            setEditingEntryId(entry.id);
            setReceiptNo(entryData.receipt_no || '');
            setReceivedDate(entryData.received_date ? new Date(entryData.received_date).toISOString().split('T')[0] : '');
            setReceivedBy(entryData.received_by || '');
            setDepartment(entryData.department || '');
            
            if (entryData.finished_goods && entryData.finished_goods.length > 0) {
                setFinishGoods(entryData.finished_goods.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate) || 0,
                    uom: item.uom || 'PC',
                    qty: parseInt(item.quantity) || 0,
                    remark: item.remark || ''
                })));
            } else {
                setFinishGoods([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '' }]);
            }
            
            if (entryData.materials_used && entryData.materials_used.length > 0) {
                setMaterialUsed(entryData.materials_used.map(item => ({
                    itemId: item.item_id,
                    unitRate: parseFloat(item.unit_rate) || 0,
                    uom: item.uom || 'PC',
                    qty: parseInt(item.quantity) || 0,
                    remark: item.remark || '',
                    availableStock: parseInt(item.available_stock) || 0
                })));
            } else {
                setMaterialUsed([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '', availableStock: 0 }]);
            }
        } catch (error) {
            console.error("Error fetching entry details:", error);
            setModal({ 
                show: true, 
                title: "❌ Loading Error", 
                message: "Failed to load entry details. Please try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const handlePrint = (entry) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>Inward Internal - ${entry.receipt_no || 'REC-' + entry.id}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            line-height: 1.6;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 2px solid #333;
                            padding-bottom: 20px;
                        }
                        .company-info {
                            margin-bottom: 20px;
                        }
                        .receipt-details { 
                            margin-bottom: 30px; 
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 20px;
                        }
                        .items { 
                            margin-top: 20px; 
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 10px; 
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 12px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2; 
                            font-weight: bold;
                        }
                        .section-header {
                            background-color: #e3f2fd;
                            padding: 10px;
                            margin: 20px 0 10px 0;
                            border-radius: 5px;
                            font-weight: bold;
                        }
                        .footer { 
                            margin-top: 40px; 
                            display: grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            gap: 20px;
                        }
                        .signature-box {
                            border-top: 1px solid #333;
                            padding-top: 10px;
                            text-align: center;
                        }
                        .print-button {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                        @media print {
                            .print-button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <button class="print-button" onclick="window.print()">Print</button>
                    
                    <div class="header">
                        <h1>INWARD (INTERNAL)</h1>
                        <h2>Receipt No: ${entry.receipt_no || 'REC-' + entry.id}</h2>
                    </div>
                    
                    <div class="receipt-details">
                        <div>
                            <p><strong>Receipt Date:</strong> ${new Date(entry.received_date).toLocaleDateString()}</p>
                            <p><strong>Department:</strong> ${entry.department || 'N/A'}</p>
                            <p><strong>Received By:</strong> ${entry.received_by || 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Receipt No:</strong> ${entry.receipt_no || 'REC-' + entry.id}</p>
                            <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
                            <p><strong>Document Type:</strong> Internal Production Receipt</p>
                        </div>
                    </div>
                    
                    <div class="items">
                        ${entry.finished_goods && entry.finished_goods.length > 0 ? `
                            <div class="section-header">Finished Goods (Added to Inventory)</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Item Name</th>
                                        <th>Item Code</th>
                                        <th>Quantity</th>
                                        <th>UOM</th>
                                        <th>Unit Rate</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${entry.finished_goods.map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${item.item_name || 'N/A'}</td>
                                            <td>${item.item_code || 'N/A'}</td>
                                            <td>${item.quantity || 0}</td>
                                            <td>${item.uom || 'PC'}</td>
                                            <td>₹${item.unit_rate || 0}</td>
                                            <td>₹${(item.quantity || 0) * (item.unit_rate || 0)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                        
                        ${entry.materials_used && entry.materials_used.length > 0 ? `
                            <div class="section-header">Materials Used (Deducted from Production Floor)</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Item Name</th>
                                        <th>Item Code</th>
                                        <th>Quantity</th>
                                        <th>UOM</th>
                                        <th>Unit Rate</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${entry.materials_used.map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${item.item_name || 'N/A'}</td>
                                            <td>${item.item_code || 'N/A'}</td>
                                            <td>${item.quantity || 0}</td>
                                            <td>${item.uom || 'PC'}</td>
                                            <td>₹${item.unit_rate || 0}</td>
                                            <td>₹${(item.quantity || 0) * (item.unit_rate || 0)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : ''}
                        
                        ${(!entry.finished_goods || entry.finished_goods.length === 0) && (!entry.materials_used || entry.materials_used.length === 0) ? 
                            '<p>No items found in this entry.</p>' : ''
                        }
                    </div>
                    
                    <div class="footer">
                        <div class="signature-box">
                            <p>Prepared By</p>
                            <br><br><br>
                            <p>_________________</p>
                        </div>
                        <div class="signature-box">
                            <p>Checked By</p>
                            <br><br><br>
                            <p>_________________</p>
                        </div>
                        <div class="signature-box">
                            <p>Received By</p>
                            <br><br><br>
                            <p>_________________</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    // ...rest of the component remains the same...
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Inward (Internal)</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex gap-2">
                        <InputField 
                            label="Receipt No" 
                            id="receiptNo" 
                            value={receiptNo} 
                            onChange={(e) => setReceiptNo(e.target.value)} 
                            placeholder="Optional"
                        />
                    </div>
                    <InputField 
                        label="Received Date" 
                        id="receivedDate" 
                        type="date" 
                        value={receivedDate} 
                        onChange={(e) => setReceivedDate(e.target.value)} 
                        required={true} 
                    />
                    <InputField 
                        label="Received By" 
                        id="receivedBy" 
                        value={receivedBy} 
                        onChange={(e) => setReceivedBy(e.target.value)} 
                        required={true} 
                        placeholder="Name of person receiving"
                    />
                    <SelectField 
                        label="Department" 
                        id="department" 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)} 
                        options={departments} 
                        required={true} 
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Finished Goods (Add to Inventory)</h3>
                    {finishGoods.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                            <SelectField 
                                label="Item" 
                                value={item.itemId} 
                                onChange={(e) => handleFinishGoodsChange(index, 'itemId', e.target.value)} 
                                options={allItems.map(item => ({ value: item.value, label: item.label }))} 
                                required={true} 
                            />
                            <InputField 
                                label="Unit Rate" 
                                type="number" 
                                step="0.01" 
                                value={item.unitRate} 
                                onChange={() => {}} // Empty function for read-only fields
                                required={true}
                                readOnly={true}
                                className="bg-gray-100 text-gray-600 pointer-events-none"
                                style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                labelClassName="text-gray-500" 
                            />
                            <InputField 
                                label="UOM" 
                                value={item.uom} 
                                onChange={() => {}} // Empty function for read-only fields
                                readOnly={true} 
                                required={true} 
                                className="bg-gray-100 text-gray-600 pointer-events-none"
                                style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                labelClassName="text-gray-500"
                            />
                            <InputField 
                                label="Quantity" 
                                type="number" 
                                step="0.01" 
                                value={item.qty} 
                                onChange={(e) => handleFinishGoodsChange(index, 'qty', parseFloat(e.target.value) || 0)} 
                                required={true} 
                            />
                            <div className="flex items-end gap-2">
                                <InputField 
                                    label="Remark" 
                                    value={item.remark} 
                                    onChange={(e) => handleFinishGoodsChange(index, 'remark', e.target.value)} 
                                />
                                <Button 
                                    onClick={() => removeFinishGoodsRow(index)} 
                                    type="button"
                                    className="mb-4 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                    disabled={finishGoods.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button 
                        onClick={addFinishGoodsRow} 
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Add Finished Good
                    </Button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Materials Used (Deduct from Production Floor)</h3>
                    {materialUsed.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                            <SelectField 
                                label="Item" 
                                value={item.itemId} 
                                onChange={(e) => handleMaterialUsedChange(index, 'itemId', e.target.value)} 
                                options={productionFloorItems.map(item => ({ value: item.value, label: item.label }))} 
                                required={true} 
                            />
                            <InputField 
                                label="Unit Rate" 
                                type="number" 
                                step="0.01" 
                                value={item.unitRate} 
                                readOnly={true}
                                className="bg-gray-100"
                            />
                            <InputField 
                                label="UOM" 
                                value={item.uom} 
                                onChange={() => {}}
                                readOnly={true} 
                                required={true} 
                                className="bg-gray-100"
                            />
                            <InputField 
                                label="Quantity" 
                                type="number" 
                                step="0.01" 
                                value={item.qty} 
                                onChange={(e) => handleMaterialUsedChange(index, 'qty', parseFloat(e.target.value) || 0)} 
                                required={true} 
                            />
                            <InputField 
                                label="Available Stock" 
                                type="number" 
                                value={item.availableStock} 
                                readOnly={true}
                                className="bg-gray-100"
                            />
                            <div className="flex items-end gap-2">
                                <InputField 
                                    label="Remark" 
                                    value={item.remark} 
                                    onChange={(e) => handleMaterialUsedChange(index, 'remark', e.target.value)} 
                                />
                                <Button 
                                    onClick={() => removeMaterialUsedRow(index)} 
                                    type="button"
                                    className="mb-4 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                    disabled={materialUsed.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button 
                        onClick={addMaterialUsedRow} 
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Add Material Used
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>📦</span>
                        {editingEntryId ? 'Update Inward Internal' : 'Add Inward Internal'}
                    </Button>
                    <Button 
                        onClick={resetForm} 
                        type="button"
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>🔄</span>
                        Clear Form
                    </Button>
                </div>
            </form>

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Inward Internal Entries</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Received By</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No inward internal entries yet.</td>
                                </tr>
                            ) : (
                                recentEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.receipt_no || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.received_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.received_by}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {entry.finished_goods && entry.finished_goods.length > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-green-600">Finished Goods:</div>
                                                    {entry.finished_goods.map((item, index) => (
                                                        <div key={index} className="text-xs ml-2">
                                                            <span className="font-medium">{item.item_name}</span>
                                                            <span className="text-gray-500"> - Qty: {item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : entry.materials_used && entry.materials_used.length > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-blue-600">Materials Used:</div>
                                                    {entry.materials_used.map((item, index) => (
                                                        <div key={index} className="text-xs ml-2">
                                                            <span className="font-medium">{item.item_name}</span>
                                                            <span className="text-gray-500"> - Qty: {item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No items</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(entry)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(entry.id, entry.receipt_no)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 mr-2">Delete</Button>
                                            <Button onClick={() => handlePrint(entry)} className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2">Print</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                autoClose={modal.autoClose}
                autoCloseDelay={modal.autoCloseDelay}
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
                showConfirmButton={modal.showConfirmButton}
            />
        </div>
    );
};

export default InwardInternalForm;