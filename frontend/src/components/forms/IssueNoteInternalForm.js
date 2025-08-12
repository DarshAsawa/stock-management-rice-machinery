import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const IssueNoteInternalForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [departments, setDepartments] = useState([
        { label: 'Production', value: 'Production' },
        { label: 'Assembly', value: 'Assembly' },
        { label: 'Quality Control', value: 'Quality Control' },
        { label: 'R&D', value: 'R&D' }
    ]);
    const [rawMaterialItems, setRawMaterialItems] = useState([]);
    const [recentEntries, setRecentEntries] = useState([]);
    const [department, setDepartment] = useState('');
    const [issueNo, setIssueNo] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [issuedBy, setIssuedBy] = useState('');
    const [issuedItems, setIssuedItems] = useState([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
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

    const generateIssueNumber = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/issue-notes-internal/generate-issue-number`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setIssueNo(data.issueNumber);
        } catch (error) {
            console.error("Error generating issue number:", error);
            setModal({ 
                show: true, 
                title: "❌ Generation Failed", 
                message: "Failed to generate issue number. Please try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const fetchRawMaterials = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/items/by-category/Raw Material`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setRawMaterialItems(data.map(i => ({ 
                id: i.id, 
                label: `${i.item_name} - ${i.full_description}`, 
                value: i.id, 
                unitRate: parseFloat(i.unit_rate), 
                stock: i.stock,
                uom: i.uom, // Make sure UOM is included
                itemCode: i.item_code,
                description: i.full_description,
                categoryName: i.category_name
            })));
        } catch (error) {
            console.error("Error fetching raw materials for issue note:", error);
            setModal({ 
                show: true, 
                title: "⚠️ Data Loading Error", 
                message: "Failed to load raw materials. Please refresh the page and try again.", 
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
            const response = await fetch(`${API_BASE_URL}/issue-notes-internal`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setRecentEntries(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching recent entries:", error);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchRawMaterials();
        fetchRecentEntries();
    }, [fetchRawMaterials, fetchRecentEntries]);

    useEffect(() => {
        if (!editingEntryId && !issueNo) {
            generateIssueNumber();
        }
    }, [editingEntryId]);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...issuedItems];
        updatedItems[index][field] = value;

        if (field === 'itemId') {
            const selectedItem = rawMaterialItems.find(i => parseInt(i.value) === parseInt(value));
            
            if (selectedItem) {
                updatedItems[index].unitRate = selectedItem.unitRate || 0;
                updatedItems[index].availableStock = selectedItem.stock || 0;
                updatedItems[index].uom = selectedItem.uom || 'PC'; // This should get the UOM from the item
            } else {
                updatedItems[index].uom = 'PC';
                updatedItems[index].unitRate = 0;
                updatedItems[index].availableStock = 0;
            }
        }
        setIssuedItems(updatedItems);
    };

    const addItemRow = () => {
        setIssuedItems([...issuedItems, { itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
    };

    const removeItemRow = (index) => {
        if (issuedItems.length > 1) {
            const updatedItems = issuedItems.filter((_, i) => i !== index);
            setIssuedItems(updatedItems);
        }
    };

    const resetForm = () => {
        setDepartment('');
        // setIssueNo('');
        setIssueDate('');
        setIssuedBy('');
        setIssuedItems([{ itemId: '', unitRate: 0, uom: '', qty: 0, remark: '', availableStock: 0 }]);
        setEditingEntryId(null);
    };

    const validateStock = () => {
        for (let item of issuedItems) {
            if (Number(item.qty) > item.availableStock) {
                const selectedItem = rawMaterialItems.find(i => i.value === Number(item.itemId));
                setModal({ 
                    show: true, 
                    title: "⚠️ Insufficient Stock Alert", 
                    message: `${selectedItem?.label || 'Selected item'} has only ${item.availableStock} units available in main stock, but you're trying to issue ${item.qty} units.\n\nPlease adjust the quantity to proceed.`, 
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
        
        if (!department || !issueNo || !issueDate || !issuedBy || issuedItems.length === 0) {
            setModal({ 
                show: true, 
                title: "❌ Validation Error", 
                message: "Please fill in all required fields:\n• Department\n• Issue Number\n• Issue Date\n• Issued By\n• At least one item", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchRecentEntries();
                    // Generate new issue number only for new entries, not edits
                    if (!editingEntryId) {
                        generateIssueNumber();
                    }
                }
            });
            return;
        }

        for (const item of issuedItems) {
            if (!item.itemId || item.qty <= 0) {
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

        if (!validateStock()) {
            return;
        }

        const issueNoteData = {
            department,
            issueNo,
            issueDate,
            issuedBy,
            items: issuedItems.map(item => ({
                itemId: item.itemId,
                unitRate: item.unitRate,
                uom: item.uom,
                qty: item.qty,
                remark: item.remark
            })),
            userId
        };

        setIsLoading(true);

        try {
            let response;
            
            if (editingEntryId) {
                response = await fetch(`${API_BASE_URL}/issue-notes-internal/${editingEntryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(issueNoteData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/issue-notes-internal`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(issueNoteData)
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
                message: `Issue Note Internal ${editingEntryId ? 'updated' : 'created'} successfully!\n\n✅ Stock has been moved to ${department} floor.\n📋 Issue Number: ${issueNo}`, 
                type: 'success',
                showConfirmButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchRecentEntries();
                    if (!editingEntryId) {
                        generateIssueNumber();
                    }
                }
            });

        } catch (error) {
            console.error("Error saving issue note:", error);
            setModal({ 
                show: true, 
                title: "❌ Operation Failed", 
                message: `Failed to ${editingEntryId ? 'update' : 'create'} issue note.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
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
        setDepartment(entry.department || '');
        setIssueNo(entry.issue_no || '');
        setIssueDate(entry.issue_date ? new Date(entry.issue_date).toISOString().split('T')[0] : '');
        setIssuedBy(entry.issued_by || '');

        if (entry.items && entry.items.length > 0) {
            setIssuedItems(entry.items.map(item => ({
                itemId: item.item_id,
                unitRate: parseFloat(item.unit_rate) || 0,
                uom: item.uom || 'PC',
                qty: parseFloat(item.quantity || item.qty) || 0, // Check both quantity and qty fields
                remark: item.remark || '',
                availableStock: item.stock || 0 // Add available stock if present
            })));
        } else {
            setIssuedItems([{ itemId: '', unitRate: 0, uom: 'PC', qty: 0, remark: '', availableStock: 0 }]);
        }
    };

    const handleDelete = (entryId, issueNo) => {
        setModal({
            show: true,
            title: "🗑️ Confirm Deletion",
            message: `Are you sure you want to delete Issue Note ${issueNo}?\n\n⚠️ This action will:\n• Permanently remove the issue note\n• Reverse all material movements\n• Cannot be undone\n\nProceed with deletion?`,
            type: 'warning',
            showConfirmButton: true,
            autoClose: false,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/issue-notes-internal/${entryId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "✅ Issue Note Deleted", 
                        message: `Issue note ${issueNo} has been successfully deleted.\n\n🔄 Material movements have been reversed.\n📊 Inventory levels have been updated.`, 
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
                    console.error("Error deleting issue note:", error);
                    setModal({ 
                        show: true, 
                        title: "❌ Deletion Failed", 
                        message: `Failed to delete issue note ${issueNo}.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
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
        const printContent = `
            <html>
                <head>
                    <title>Issue Note Internal - ${entry.issue_no}</title>
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
                        .issue-details { 
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
                        <h1>ISSUE NOTE (INTERNAL)</h1>
                        <h2>Issue No: ${entry.issue_no}</h2>
                    </div>
                    
                    <div class="issue-details">
                        <div>
                            <p><strong>Issue Date:</strong> ${new Date(entry.issue_date).toLocaleDateString()}</p>
                            <p><strong>Department:</strong> ${entry.department || 'N/A'}</p>
                            <p><strong>Issued By:</strong> ${entry.issued_by || 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Issue No:</strong> ${entry.issue_no || 'N/A'}</p>
                            <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
                            <p><strong>Document Type:</strong> Internal Material Issue</p>
                        </div>
                    </div>
                    
                    <div class="items">
                        <h3>Items Issued</h3>
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
                            <p>Issued By</p>
                            <br><br><br>
                            <p>_________________</p>
                        </div>
                        <div class="signature-box">
                            <p>Authorized By</p>
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
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Issue Note (Internal)</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex gap-2">
                        <InputField 
                            label="Issue No" 
                            id="issueNo" 
                            value={issueNo} 
                            onChange={(e) => setIssueNo(e.target.value)} 
                            required={true} 
                            readOnly={true}
                            className="bg-gray-100"
                        />
                    </div>
                    <InputField 
                        label="Issue Date" 
                        id="issueDate" 
                        type="date" 
                        value={issueDate} 
                        onChange={(e) => setIssueDate(e.target.value)} 
                        required={true} 
                    />
                    <SelectField 
                        label="Department" 
                        id="department" 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)} 
                        options={departments} 
                        required={true} 
                    />
                    <InputField 
                        label="Issued By" 
                        id="issuedBy" 
                        value={issuedBy} 
                        onChange={(e) => setIssuedBy(e.target.value)} 
                        required={true} 
                        placeholder="Name of person issuing"
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Items to Issue</h3>
                    {issuedItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                            <SelectField 
                                label="Item" 
                                value={item.itemId} 
                                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                                options={rawMaterialItems.map(item => ({ value: item.value, label: item.label }))} 
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
                                onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)} 
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
                                    onChange={(e) => handleItemChange(index, 'remark', e.target.value)} 
                                />
                                <Button 
                                    onClick={() => removeItemRow(index)} 
                                    type="button"
                                    className="mb-4 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                    disabled={issuedItems.length === 1}
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
                        <span>📋</span>
                        {editingEntryId ? 'Update Issue Note' : 'Add Issue Note'}
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

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Recent Issue Notes</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issue No</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Issued By</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Items</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No issue notes yet.</td>
                                </tr>
                            ) : (
                                recentEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{entry.issue_no}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{new Date(entry.issue_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.department}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{entry.issued_by}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {entry.items && entry.items.length > 0 ? (
                                                <div className="space-y-1">
                                                    {entry.items.map((item, index) => (
                                                        <div key={index} className="text-xs">
                                                            <span className="font-medium">{item.item_name}</span>
                                                            <span className="text-gray-500"> - Qty: {item.quantity || item.qty || 0}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No items</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(entry)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(entry.id, entry.issue_no)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 mr-2">Delete</Button>
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

export default IssueNoteInternalForm;