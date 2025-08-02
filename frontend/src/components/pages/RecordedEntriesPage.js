import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const RecordedEntriesPage = () => {
    const { API_BASE_URL } = useContext(AppContext);
    const [allEntries, setAllEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const fetchAllEntries = useCallback(async () => {
        try {
            setIsLoading(true);
            const [
                gateInwardsResponse,
                issueNotesResponse,
                inwardInternalsResponse,
                outwardChallansResponse
            ] = await Promise.all([
                fetch(`${API_BASE_URL}/gate-inwards`),
                fetch(`${API_BASE_URL}/issue-notes-internal`),
                fetch(`${API_BASE_URL}/inward-internals`),
                fetch(`${API_BASE_URL}/outward-challans`)
            ]);

            if (!gateInwardsResponse.ok || !issueNotesResponse.ok || 
                !inwardInternalsResponse.ok || !outwardChallansResponse.ok) {
                throw new Error('Failed to fetch entries');
            }

            const gateInwards = await gateInwardsResponse.json();
            const issueNotes = await issueNotesResponse.json();
            const inwardInternals = await inwardInternalsResponse.json();
            const outwardChallans = await outwardChallansResponse.json();

            // Combine all entries with type identification
            const combinedEntries = [
                ...gateInwards.map(entry => ({ ...entry, type: 'gate_inward', typeLabel: 'Gate Inward' })),
                ...issueNotes.map(entry => ({ ...entry, type: 'issue_note', typeLabel: 'Issue Note' })),
                ...inwardInternals.map(entry => ({ ...entry, type: 'inward_internal', typeLabel: 'Inward Internal' })),
                ...outwardChallans.map(entry => ({ ...entry, type: 'outward_challan', typeLabel: 'Outward Challan' }))
            ];

            setAllEntries(combinedEntries);
        } catch (error) {
            console.error("Error fetching recorded entries:", error);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchAllEntries();
    }, [fetchAllEntries]);

    const filteredEntries = allEntries.filter(entry => {
        const matchesType = activeTab === 'all' || entry.type === activeTab;
        const matchesSearch = 
            (entry.grn_number && entry.grn_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.issue_no && entry.issue_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.receipt_no && entry.receipt_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.challan_no && entry.challan_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.supplier_name && entry.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.customer_name && entry.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (entry.department && entry.department.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesType && matchesSearch;
    });

    const sortedEntries = [...filteredEntries].sort((a, b) => {
        const dateA = new Date(a.grn_date || a.issue_date || a.received_date || a.challan_date);
        const dateB = new Date(b.grn_date || b.issue_date || b.received_date || b.challan_date);
        
        switch (sortBy) {
            case 'date':
                return dateB - dateA; // Most recent first
            case 'type':
                return a.typeLabel.localeCompare(b.typeLabel);
            default:
                return 0;
        }
    });

    const getEntryStats = () => {
        const gateInwards = allEntries.filter(e => e.type === 'gate_inward').length;
        const issueNotes = allEntries.filter(e => e.type === 'issue_note').length;
        const inwardInternals = allEntries.filter(e => e.type === 'inward_internal').length;
        const outwardChallans = allEntries.filter(e => e.type === 'outward_challan').length;
        
        return { gateInwards, issueNotes, inwardInternals, outwardChallans, total: allEntries.length };
    };

    const stats = getEntryStats();

    const handleEntryClick = (entry) => {
        setSelectedEntry(entry);
        setShowDetailModal(true);
    };

    const handlePrint = (entry) => {
        // Create a print-friendly version of the entry
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>${getEntryTitle(entry)} - ${entry.grn_number || entry.issue_no || entry.receipt_no || entry.challan_no}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .details { margin-bottom: 20px; }
                        .items { margin-top: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .footer { margin-top: 30px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${getEntryTitle(entry)}</h1>
                        <h2>${entry.grn_number || entry.issue_no || entry.receipt_no || entry.challan_no}</h2>
                    </div>
                    <div class="details">
                        <p><strong>Date:</strong> ${getEntryDate(entry)}</p>
                        <p><strong>Department:</strong> ${entry.department || 'N/A'}</p>
                        <p><strong>${entry.type === 'gate_inward' ? 'Supplier' : entry.type === 'outward_challan' ? 'Customer' : 'Issued/Received By'}:</strong> ${entry.supplier_name || entry.customer_name || entry.issued_by || entry.received_by || 'N/A'}</p>
                        ${entry.transport ? `<p><strong>Transport:</strong> ${entry.transport}</p>` : ''}
                        ${entry.vehicle_no ? `<p><strong>Vehicle No:</strong> ${entry.vehicle_no}</p>` : ''}
                    </div>
                    <div class="items">
                        <h3>Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entry.items ? entry.items.map(item => `
                                    <tr>
                                        <td>${item.item_name || item.item_description || 'N/A'}</td>
                                        <td>${item.qty || item.quantity || 0}</td>
                                        <td>₹${item.unit_rate || 0}</td>
                                        <td>₹${(item.qty || item.quantity || 0) * (item.unit_rate || 0)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4">No items found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'gate_inward': return 'bg-green-100 text-green-800';
            case 'issue_note': return 'bg-blue-100 text-blue-800';
            case 'inward_internal': return 'bg-purple-100 text-purple-800';
            case 'outward_challan': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEntryTitle = (entry) => {
        switch (entry.type) {
            case 'gate_inward': return `GRN: ${entry.grn_number}`;
            case 'issue_note': return `Issue: ${entry.issue_no}`;
            case 'inward_internal': return `Receipt: ${entry.receipt_no || 'N/A'}`;
            case 'outward_challan': return `Challan: ${entry.challan_no}`;
            default: return 'Unknown Entry';
        }
    };

    const getEntryDate = (entry) => {
        return entry.grn_date || entry.issue_date || entry.received_date || entry.challan_date;
    };

    const getEntryDescription = (entry) => {
        switch (entry.type) {
            case 'gate_inward': return `Received from ${entry.supplier_name}`;
            case 'issue_note': return `Issued to ${entry.department} by ${entry.issued_by}`;
            case 'inward_internal': return `Received by ${entry.received_by} in ${entry.department}`;
            case 'outward_challan': return `Dispatched to ${entry.customer_name}`;
            default: return 'No description available';
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Recorded Entries</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Entries</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-sm text-blue-600 mt-1">All Records</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Gate Inwards</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.gateInwards}</p>
                    <p className="text-sm text-green-600 mt-1">GRN Records</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Issue Notes</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.issueNotes}</p>
                    <p className="text-sm text-blue-600 mt-1">Material Issues</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Inward Internals</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.inwardInternals}</p>
                    <p className="text-sm text-purple-600 mt-1">Production Complete</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Outward Challans</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats.outwardChallans}</p>
                    <p className="text-sm text-orange-600 mt-1">Dispatches</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'all' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    All Entries ({stats.total})
                </button>
                <button
                    onClick={() => setActiveTab('gate_inward')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'gate_inward' 
                            ? 'bg-white text-green-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Gate Inwards ({stats.gateInwards})
                </button>
                <button
                    onClick={() => setActiveTab('issue_note')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'issue_note' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Issue Notes ({stats.issueNotes})
                </button>
                <button
                    onClick={() => setActiveTab('inward_internal')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'inward_internal' 
                            ? 'bg-white text-purple-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Inward Internals ({stats.inwardInternals})
                </button>
                <button
                    onClick={() => setActiveTab('outward_challan')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'outward_challan' 
                            ? 'bg-white text-orange-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Outward Challans ({stats.outwardChallans})
                </button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by number, supplier, customer, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="date">Sort by Date (Recent)</option>
                        <option value="type">Sort by Type</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-4">
                    {sortedEntries.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No entries found matching your criteria.</p>
                        </div>
                    ) : (
                        sortedEntries.map((entry) => (
                            <div 
                                key={`${entry.type}-${entry.id}`} 
                                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleEntryClick(entry)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {getEntryTitle(entry)}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                                                {entry.typeLabel}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{getEntryDescription(entry)}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>📅 {new Date(getEntryDate(entry)).toLocaleDateString()}</span>
                                            {entry.items && (
                                                <span>📦 {entry.items.length} items</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                            {entry.type === 'gate_inward' && entry.supplier_name && (
                                                <p>Supplier: {entry.supplier_name}</p>
                                            )}
                                            {entry.type === 'outward_challan' && entry.customer_name && (
                                                <p>Customer: {entry.customer_name}</p>
                                            )}
                                            {entry.type === 'issue_note' && entry.department && (
                                                <p>Department: {entry.department}</p>
                                            )}
                                            {entry.type === 'inward_internal' && entry.department && (
                                                <p>Department: {entry.department}</p>
                                            )}
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePrint(entry);
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                            >
                                                🖨️ Print
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Entry Type Distribution */}
            {!isLoading && allEntries.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Entry Type Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Gate Inwards</span>
                                <span className="text-lg font-bold text-green-600">{stats.gateInwards}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.gateInwards / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.gateInwards / stats.total) * 100).toFixed(1)}% of total entries
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Issue Notes</span>
                                <span className="text-lg font-bold text-blue-600">{stats.issueNotes}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.issueNotes / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.issueNotes / stats.total) * 100).toFixed(1)}% of total entries
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Inward Internals</span>
                                <span className="text-lg font-bold text-purple-600">{stats.inwardInternals}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-purple-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.inwardInternals / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.inwardInternals / stats.total) * 100).toFixed(1)}% of total entries
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Outward Challans</span>
                                <span className="text-lg font-bold text-orange-600">{stats.outwardChallans}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-orange-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.outwardChallans / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.outwardChallans / stats.total) * 100).toFixed(1)}% of total entries
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {getEntryTitle(selectedEntry)} - {selectedEntry.grn_number || selectedEntry.issue_no || selectedEntry.receipt_no || selectedEntry.challan_no}
                            </h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Entry Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Date:</strong> {getEntryDate(selectedEntry)}</p>
                                    <p><strong>Type:</strong> {selectedEntry.typeLabel}</p>
                                    {selectedEntry.department && (
                                        <p><strong>Department:</strong> {selectedEntry.department}</p>
                                    )}
                                    {selectedEntry.supplier_name && (
                                        <p><strong>Supplier:</strong> {selectedEntry.supplier_name}</p>
                                    )}
                                    {selectedEntry.customer_name && (
                                        <p><strong>Customer:</strong> {selectedEntry.customer_name}</p>
                                    )}
                                    {selectedEntry.issued_by && (
                                        <p><strong>Issued By:</strong> {selectedEntry.issued_by}</p>
                                    )}
                                    {selectedEntry.received_by && (
                                        <p><strong>Received By:</strong> {selectedEntry.received_by}</p>
                                    )}
                                    {selectedEntry.transport && (
                                        <p><strong>Transport:</strong> {selectedEntry.transport}</p>
                                    )}
                                    {selectedEntry.vehicle_no && (
                                        <p><strong>Vehicle No:</strong> {selectedEntry.vehicle_no}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Items</h3>
                                {selectedEntry.items && selectedEntry.items.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedEntry.items.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded border">
                                                <p className="font-medium">{item.item_name || item.item_description || 'N/A'}</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-1">
                                                    <span>Qty: {item.qty || item.quantity || 0}</span>
                                                    <span>Rate: ₹{item.unit_rate || 0}</span>
                                                    <span>Amount: ₹{(item.qty || item.quantity || 0) * (item.unit_rate || 0)}</span>
                                                    {item.uom && <span>UOM: {item.uom}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No items found</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handlePrint(selectedEntry)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                🖨️ Print
                            </button>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecordedEntriesPage;