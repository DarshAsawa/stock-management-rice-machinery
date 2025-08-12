import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const GateInwardForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [recentEntries, setRecentEntries] = useState([]);
    const [grnNumber, setGrnNumber] = useState('');
    const [grnDate, setGrnDate] = useState('');
    const [billNo, setBillNo] = useState('');
    const [billDate, setBillDate] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [itemsList, setItemsList] = useState([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '' }]);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

    const generateGrnNumber = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/gate-inwards/generate-grn-number`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setGrnNumber(data.grnNumber);
        } catch (error) {
            console.error("Error generating GRN number:", error);
            setModal({ 
                show: true, 
                title: "Error", 
                message: "Failed to generate GRN number. Please try again.", 
                onClose: () => setModal({ ...modal, show: false }) 
            });
        }
    };

    const fetchInitialData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [suppliersResponse, rawMaterialsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/parties`),
                fetch(`${API_BASE_URL}/items/by-category/Raw Material`)
            ]);

            if (!suppliersResponse.ok || !rawMaterialsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const suppliersData = await suppliersResponse.json();
            const rawMaterialsData = await rawMaterialsResponse.json();

            setSuppliers(suppliersData);
            setItems(rawMaterialsData); // Only raw materials for gate inward
        } catch (error) {
            console.error("Error fetching data:", error);
            setModal({ show: true, title: "Error", message: "Failed to load data. Please try again.", onClose: () => setModal(m => ({ ...m, show: false })) });
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    const fetchRecentEntries = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/gate-inwards`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setRecentEntries(data.slice(0, 10)); // Show last 10 entries
        } catch (error) {
            console.error("Error fetching recent entries:", error);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchInitialData();
        fetchRecentEntries();
    }, [fetchInitialData, fetchRecentEntries]);

    // Auto-generate GRN number when form is empty (new entry)
    useEffect(() => {
        if (!editingEntryId && !grnNumber) {
            generateGrnNumber();
        }
    }, [editingEntryId]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...itemsList];
        newItems[index] = { ...newItems[index], [field]: value };
        // Auto-fill UOM and Unit Rate when itemId changes
        if (field === 'itemId') {
            const selectedItem = items.find(i => parseInt(i.id) === parseInt(value));
            console.log('Item selection for UOM and rate auto-fill:', {
                selectedValue: value,
                selectedItem,
                allItems: items.map(item => ({ id: item.id, name: item.item_name, uom: item.uom, rate: item.unit_rate }))
            });
            if (selectedItem) {
                newItems[index].uom = selectedItem.uom || 'PC';
                newItems[index].unitRate = parseFloat(selectedItem.unit_rate) || 0;
                console.log('UOM and rate auto-filled:', selectedItem.uom, selectedItem.unit_rate);
            } else {
                newItems[index].uom = 'PC';
                newItems[index].unitRate = 0;
                console.log('No item found, using defaults');
            }
        }
        // Calculate amount if unit rate or quantity changes
        if (field === 'unitRate' || field === 'quantity') {
            const unitRate = parseFloat(newItems[index].unitRate) || 0;
            const quantity = parseFloat(newItems[index].quantity) || 0;
            newItems[index].amount = unitRate * quantity;
        }
        setItemsList(newItems);
    };
    
    const handleEdit = (entry) => {
        setEditingEntryId(entry.id);
        setGrnNumber(entry.grn_number || '');
        setGrnDate(entry.grn_date ? new Date(entry.grn_date).toISOString().split('T')[0] : '');
        setBillNo(entry.bill_no || '');
        setBillDate(entry.bill_date ? new Date(entry.bill_date).toISOString().split('T')[0] : '');
        setSupplierId(entry.supplier_id || '');
        setPaymentTerms(entry.payment_terms || '');

        // Load items if available
        if (entry.items && entry.items.length > 0) {
            setItemsList(entry.items.map(item => ({
                itemId: item.item_id,
                unitRate: parseFloat(item.unit_rate) || 0,
                uom: item.uom || 'PC',
                quantity: parseInt(item.quantity) || 0,
                amount: parseFloat(item.amount) || 0,
                remark: item.remark || ''
            })));
        } else {
            setItemsList([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '' }]);
        }
    };

    const addItemRow = () => {
        setItemsList([...itemsList, { itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '' }]);
    };

    const removeItemRow = (index) => {
        if (itemsList.length > 1) {
            setItemsList(itemsList.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        // setGrnNumber('');
        setGrnDate('');
        setBillNo('');
        setBillDate('');
        setSupplierId('');
        setPaymentTerms('');
        setItemsList([{ itemId: '', unitRate: 0, uom: 'PC', quantity: 0, amount: 0, remark: '' }]);
        setEditingEntryId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!grnNumber || !grnDate || !supplierId || itemsList.length === 0) {
            setModal({ 
                show: true, 
                title: "Validation Error", 
                message: "Please fill in all required fields: GRN Number, GRN Date, Party, and at least one item.", 
                type: 'error',
                onClose: () => setModal({ ...modal, show: false }) 
            });
            return;
        }

        // Validate items
        for (const item of itemsList) {
            if (!item.itemId || item.quantity <= 0) {
                setModal({ 
                    show: true, 
                    title: "Validation Error", 
                    message: "Please ensure all items have valid details: Item selection and quantity greater than 0.", 
                    type: 'error',
                    onClose: () => setModal({ ...modal, show: false }) 
                });
                return;
            }
        }

        const gateInwardData = {
            grn: grnNumber,
            grnDate,
            billNo: billNo || null,
            billDate: billDate || null,
            supplierId,
            paymentTerms,
            items: itemsList.map(item => ({
                itemId: item.itemId,
                unitRate: item.unitRate,
                uom: item.uom,
                qty: item.quantity,
                amount: item.amount,
                remark: item.remark
            })),
            userId
        };

        try {
            let response;
            if (editingEntryId) {
                response = await fetch(`${API_BASE_URL}/gate-inwards/${editingEntryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gateInwardData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/gate-inwards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gateInwardData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Success message with auto-close
            setModal({ 
                show: true, 
                title: "Success!", 
                message: `Gate Inward entry ${editingEntryId ? 'updated' : 'created'} successfully! Stock levels have been updated accordingly.`, 
                type: 'success',
                autoClose: true,
                autoCloseDelay: 2000,
                onClose: () => setModal({ ...modal, show: false }) 
            });
            
            resetForm();
            fetchRecentEntries();
            
            // Generate new GRN number for next entry (only for new entries, not edits)
            if (!editingEntryId) {
                await generateGrnNumber();
            }
            
        } catch (error) {
            console.error("Error saving gate inward:", error);
            setModal({ 
                show: true, 
                title: "Error", 
                message: `Failed to save gate inward entry. ${error.message}`, 
                type: 'error',
                onClose: () => setModal({ ...modal, show: false }) 
            });
        }
    };

    const handleDelete = (entryId) => {
        setModal({
            show: true,
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this gate inward entry? This action cannot be undone and will reverse stock changes.",
            type: 'warning',
            showConfirmButton: true,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/gate-inwards/${entryId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "Deleted Successfully", 
                        message: "Gate inward entry has been deleted and stock levels have been restored.", 
                        type: 'success',
                        autoClose: true,
                        autoCloseDelay: 2000,
                        onClose: () => setModal({ ...modal, show: false }) 
                    });
                    
                    fetchRecentEntries();
                } catch (error) {
                    console.error("Error deleting gate inward:", error);
                    setModal({ 
                        show: true, 
                        title: "Deletion Failed", 
                        message: `Failed to delete gate inward entry. ${error.message}`, 
                        type: 'error',
                        onClose: () => setModal({ ...modal, show: false }) 
                    });
                }
            },
            onClose: () => setModal({ ...modal, show: false })
        });
    };

    const handlePrint = (entry) => {
        // Create a print-friendly version of the gate inward entry
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>Gate Inward - ${entry.grn_number}</title>
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
                        .grn-details { 
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
                        <h1>GATE INWARD</h1>
                        <h2>GRN No: ${entry.grn_number}</h2>
                    </div>
                    
                    <div class="grn-details">
                        <div>
                            <p><strong>GRN Date:</strong> ${new Date(entry.grn_date).toLocaleDateString()}</p>
                            <p><strong>Supplier:</strong> ${entry.supplier_name || 'N/A'}</p>
                            <p><strong>Bill No:</strong> ${entry.bill_no || 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Bill Date:</strong> ${entry.bill_date ? new Date(entry.bill_date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Payment Terms:</strong> ${entry.payment_terms || 'N/A'}</p>
                            <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="items">
                        <h3>Items Received</h3>
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
                                        <td>${item.uom || 'PC'}</td>
                                        <td>₹${item.unit_rate || 0}</td>
                                        <td>₹${(item.quantity || 0) * (item.unit_rate || 0)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="7">No items found</td></tr>'}
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
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Gate Inward</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex gap-2">
                        <InputField 
                            label="GRN Number" 
                            id="grnNumber" 
                            value={grnNumber} 
                            onChange={(e) => setGrnNumber(e.target.value)} 
                            required={true} 
                            readOnly={true}
                            className="bg-gray-100"
                        />

                    </div>
                    <InputField 
                        label="GRN Date" 
                        id="grnDate" 
                        type="date" 
                        value={grnDate} 
                        onChange={(e) => setGrnDate(e.target.value)} 
                        required={true} 
                    />
                    <InputField 
                        label="Bill No" 
                        id="billNo" 
                        value={billNo} 
                        onChange={(e) => setBillNo(e.target.value)} 
                        placeholder="Optional"
                    />
                    <InputField 
                        label="Bill Date" 
                        id="billDate" 
                        type="date" 
                        value={billDate} 
                        onChange={(e) => setBillDate(e.target.value)} 
                    />
                    <SelectField 
                        label="Party" 
                        id="supplierId" 
                        value={supplierId} 
                        onChange={(e) => setSupplierId(e.target.value)} 
                        options={suppliers.map(supplier => ({ value: supplier.id, label: supplier.party_name }))} 
                        required={true} 
                    />
                    <InputField 
                        label="Payment Terms" 
                        id="paymentTerms" 
                        value={paymentTerms} 
                        onChange={(e) => setPaymentTerms(e.target.value)} 
                        placeholder="e.g., Net 30 days"
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Items</h3>
                    {itemsList.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
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

                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>📥</span>
                        {editingEntryId ? 'Update Gate Inward' : 'Add Gate Inward'}
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

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Gate Inward Entries</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GRN#</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bill No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">No gate inward entries yet.</td>
                                </tr>
                            ) : (
                                recentEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.grn_number}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.grn_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.supplier_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.bill_no || '-'}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(entry)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 mr-2">Delete</Button>
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

export default GateInwardForm; 