import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const OutwardChallanForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [recentEntries, setRecentEntries] = useState([]);
    const [challanNo, setChallanNo] = useState('');
    const [challanDate, setChallanDate] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [transportMode, setTransportMode] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [driverName, setDriverName] = useState('');
    const [itemsList, setItemsList] = useState([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '', availableStock: 0 }]);
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

    const generateChallanNumber = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/outward-challans/generate-challan-number`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setChallanNo(data.challanNumber);
        } catch (error) {
            console.error("Error generating challan number:", error);
            setModal({ 
                show: true, 
                title: "❌ Generation Failed", 
                message: "Failed to generate challan number. Please try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const fetchInitialData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [customersResponse, itemsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/parties`),
                fetch(`${API_BASE_URL}/items`)
            ]);

            if (!customersResponse.ok || !itemsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const customersData = await customersResponse.json();
            const itemsData = await itemsResponse.json();

            setCustomers(customersData);
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setModal({ 
                show: true, 
                title: "⚠️ Data Loading Error", 
                message: "Failed to load initial data. Please refresh the page and try again.", 
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
            const response = await fetch(`${API_BASE_URL}/outward-challans`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setRecentEntries(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching recent entries:", error);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchInitialData();
        fetchRecentEntries();
    }, [fetchInitialData, fetchRecentEntries]);

    useEffect(() => {
        if (!editingEntryId && !challanNo) {
            generateChallanNumber();
        }
    }, [editingEntryId]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...itemsList];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'itemId') {
            const selectedItem = items.find(i => parseInt(i.id) === parseInt(value));
            if (selectedItem) {
                newItems[index].uom = selectedItem.uom || 'PC';
                newItems[index].unitRate = parseFloat(selectedItem.unit_rate) || 0;
                newItems[index].availableStock = selectedItem.stock || 0;
            } else {
                newItems[index].uom = 'PC';
                newItems[index].unitRate = 0;
                newItems[index].availableStock = 0;
            }
        }
        
        if (field === 'unitRate' || field === 'quantity') {
            const unitRate = parseFloat(newItems[index].unitRate) || 0;
            const quantity = parseFloat(newItems[index].quantity) || 0;
            newItems[index].amount = unitRate * quantity;
        }

        setItemsList(newItems);
    };

    const addItemRow = () => {
        setItemsList([...itemsList, { itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '', availableStock: 0 }]);
    };

    const removeItemRow = (index) => {
        if (itemsList.length > 1) {
            setItemsList(itemsList.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setChallanNo('');
        setChallanDate('');
        setCustomerId('');
        setTransportMode('');
        setVehicleNo('');
        setDriverName('');
        setItemsList([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '', availableStock: 0 }]);
        setEditingEntryId(null);
    };

    const validateStock = () => {
        for (let item of itemsList) {
            if (Number(item.quantity) > item.availableStock) {
                const selectedItem = items.find(i => i.id === item.itemId);
                setModal({ 
                    show: true, 
                    title: "⚠️ Insufficient Stock Alert", 
                    message: `${selectedItem?.item_name || 'Selected item'} has only ${item.availableStock} units available, but you're trying to dispatch ${item.quantity} units.\n\nPlease adjust the quantity to proceed.`, 
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
        
        if (!validateStock()) {
            return;
        }

        if (!challanNo || !challanDate || !customerId || itemsList.length === 0) {
            setModal({ 
                show: true, 
                title: "❌ Validation Error", 
                message: "Please fill in all required fields:\n• Challan Number\n• Challan Date\n• Party\n• At least one item", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        for (const item of itemsList) {
            if (!item.itemId || item.quantity <= 0) {
                setModal({ 
                    show: true, 
                    title: "❌ Item Validation Error", 
                    message: "Please ensure all items have:\n• Valid item selection\n• Quantity greater than 0\n\nCheck all item rows before submitting.", 
                    type: 'error',
                    showConfirmButton: false,
                    autoClose: false,
                    onClose: () => setModal(prev => ({ ...prev, show: false }))
                });
                return;
            }
        }

        const outwardData = {
            partyId: customerId,
            challanNo,
            challanDate,
            transport: transportMode,
            lrNo: vehicleNo,
            remark: driverName,
            items: itemsList.map(item => ({
                itemId: item.itemId,
                valueOfGoodsUom: item.uom,
                qty: item.quantity,
                remark: item.remark
            })),
            userId
        };

        setIsLoading(true);

        try {
            let response;
            if (editingEntryId) {
                response = await fetch(`${API_BASE_URL}/outward-challans/${editingEntryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(outwardData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/outward-challans`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(outwardData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            setModal({ 
                show: true, 
                title: "🎉 Success!", 
                message: `Outward Challan ${editingEntryId ? 'updated' : 'created'} successfully!\n\n✅ Items have been dispatched.\n📋 Challan Number: ${challanNo}`, 
                type: 'success',
                showConfirmButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchRecentEntries();
                    if (!editingEntryId) {
                        generateChallanNumber();
                    }
                }
            });

        } catch (error) {
            console.error("Error saving outward challan:", error);
            setModal({ 
                show: true, 
                title: "❌ Operation Failed", 
                message: `Failed to ${editingEntryId ? 'update' : 'create'} outward challan.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setEditingEntryId(entry.id);
        setChallanNo(entry.challan_no || '');
        setChallanDate(entry.challan_date ? new Date(entry.challan_date).toISOString().split('T')[0] : '');
        setCustomerId(entry.party_id || '');
        setTransportMode(entry.transport || '');
        setVehicleNo(entry.lr_no || '');
        setDriverName(entry.remark || '');
        
        if (entry.items && entry.items.length > 0) {
            setItemsList(entry.items.map(item => ({
                itemId: item.item_id,
                unitRate: item.unit_rate || 0,
                uom: item.value_of_goods_uom || 'PC',
                quantity: item.quantity,
                amount: (item.quantity * (item.unit_rate || 0)),
                remark: item.remark || '',
                availableStock: 0
            })));
        } else {
            setItemsList([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '', availableStock: 0 }]);
        }
    };

    const handleDelete = (entryId, challanNo) => {
        setModal({
            show: true,
            title: "🗑️ Confirm Deletion",
            message: `Are you sure you want to delete Outward Challan ${challanNo}?\n\n⚠️ This action will:\n• Permanently remove the challan\n• Reverse all stock movements\n• Cannot be undone\n\nProceed with deletion?`,
            type: 'warning',
            showConfirmButton: true,
            autoClose: false,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/outward-challans/${entryId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "✅ Challan Deleted", 
                        message: `Outward challan ${challanNo} has been successfully deleted.\n\n🔄 Stock levels have been restored.\n📊 Inventory updated.`, 
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
                    console.error("Error deleting outward challan:", error);
                    setModal({ 
                        show: true, 
                        title: "❌ Deletion Failed", 
                        message: `Failed to delete outward challan ${challanNo}.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
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

    const handlePrint = (entry) => {
        const printWindow = window.open('', '_blank');
        const totalAmount = entry.items ? entry.items.reduce((sum, item) => sum + (item.quantity * (item.unit_rate || 0)), 0) : 0;
        
        const printContent = `
            <html>
                <head>
                    <title>Outward Challan - ${entry.challan_no}</title>
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
                        .challan-details { 
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
                        .total-row {
                            font-weight: bold;
                            background-color: #f9f9f9;
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
                        <h1>OUTWARD CHALLAN</h1>
                        <h2>Challan No: ${entry.challan_no}</h2>
                    </div>
                    
                    <div class="company-info">
                        <h3>Flour Mill ERP System</h3>
                        <p>Address: [Your Company Address]</p>
                        <p>Phone: [Your Phone Number] | Email: [Your Email]</p>
                    </div>
                    
                    <div class="challan-details">
                        <div>
                            <p><strong>Challan Date:</strong> ${new Date(entry.challan_date).toLocaleDateString()}</p>
                            <p><strong>Party/Customer:</strong> ${entry.party_name || 'N/A'}</p>
                            <p><strong>Transport Mode:</strong> ${entry.transport || 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Vehicle No:</strong> ${entry.lr_no || 'N/A'}</p>
                            <p><strong>Driver Name:</strong> ${entry.remark || 'N/A'}</p>
                            <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="items">
                        <h3>Items Dispatched</h3>
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
                                ${entry.items ? entry.items.map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.item_name || 'N/A'}</td>
                                        <td>${item.item_code || 'N/A'}</td>
                                        <td>${item.quantity || 0}</td>
                                        <td>${item.value_of_goods_uom || 'PC'}</td>
                                        <td>₹${item.unit_rate || 0}</td>
                                        <td>₹${(item.quantity || 0) * (item.unit_rate || 0)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="7">No items found</td></tr>'}
                                <tr class="total-row">
                                    <td colspan="6" style="text-align: right;"><strong>Total Amount:</strong></td>
                                    <td><strong>₹${totalAmount.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
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

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Outward Challan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex gap-2">
                        <InputField 
                            label="Challan No" 
                            id="challanNo" 
                            value={challanNo} 
                            onChange={(e) => setChallanNo(e.target.value)} 
                            required={true} 
                            readOnly={true}
                            className="bg-gray-100"
                        />
                    </div>
                    <InputField 
                        label="Challan Date" 
                        id="challanDate" 
                        type="date" 
                        value={challanDate} 
                        onChange={(e) => setChallanDate(e.target.value)} 
                        required={true} 
                    />
                    <SelectField 
                        label="Party" 
                        id="customerId" 
                        value={customerId} 
                        onChange={(e) => setCustomerId(e.target.value)} 
                        options={customers.map(customer => ({ value: customer.id, label: customer.party_name }))} 
                        required={true} 
                    />
                    <InputField 
                        label="Transport Mode" 
                        id="transportMode" 
                        value={transportMode} 
                        onChange={(e) => setTransportMode(e.target.value)} 
                        placeholder="e.g., Road, Rail, Air"
                    />
                    <InputField 
                        label="Vehicle No" 
                        id="vehicleNo" 
                        value={vehicleNo} 
                        onChange={(e) => setVehicleNo(e.target.value)} 
                        placeholder="e.g., MH12AB1234"
                    />
                    <InputField 
                        label="Driver Name" 
                        id="driverName" 
                        value={driverName} 
                        onChange={(e) => setDriverName(e.target.value)} 
                        placeholder="Name of driver"
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Items to Dispatch</h3>
                    {itemsList.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                            <SelectField 
                                label="Item" 
                                value={item.itemId} 
                                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                                options={items.map(item => ({ value: item.id, label: item.item_name }))} 
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
                                value={item.quantity} 
                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                                required={true} 
                            />
                            <InputField 
                                label="Amount" 
                                type="number" 
                                step="0.01" 
                                value={item.amount} 
                                readOnly={true}
                                className="bg-gray-100"
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
                                    onChange={(e) => handleItemChange(index, 'remark', e.target.value)} 
                                />
                                <Button 
                                    onClick={() => removeItemRow(index)} 
                                    type="button"
                                    className="mb-4 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                    disabled={itemsList.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button 
                        onClick={addItemRow} 
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Add Item
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>📤</span>
                        {editingEntryId ? 'Update Outward Challan' : 'Add Outward Challan'}
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

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Outward Challans</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Challan No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Transport</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No outward challans yet.</td>
                                </tr>
                            ) : (
                                recentEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.challan_no}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.challan_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.party_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {entry.items && entry.items.length > 0 ? (
                                                <div className="space-y-1">
                                                    {entry.items.map((item, index) => (
                                                        <div key={index} className="text-xs">
                                                            <span className="font-medium">{item.item_name}</span>
                                                            <span className="text-gray-500"> - Qty: {item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No items</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.transport || '-'}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(entry)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(entry.id, entry.challan_no)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 mr-2">Delete</Button>
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
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
                showConfirmButton={modal.showConfirmButton}
                autoClose={modal.autoClose}
                autoCloseDelay={modal.autoCloseDelay}
            />
        </div>
    );
};

export default OutwardChallanForm;