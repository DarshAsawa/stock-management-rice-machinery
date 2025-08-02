import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const PartyOverviewPage = () => {
    const { API_BASE_URL } = useContext(AppContext);
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const fetchParties = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/parties`);
            if (!response.ok) throw new Error('Failed to fetch parties');
            
            const data = await response.json();
            setParties(data);
        } catch (error) {
            console.error("Error fetching parties:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParties();
    }, []);

    const filteredParties = parties.filter(party => {
        const matchesSearch = party.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            party.party_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (party.gst_number && party.gst_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (party.city && party.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (party.address && party.address.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const sortedParties = [...filteredParties].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.party_name.localeCompare(b.party_name);
            case 'code':
                return a.party_code.localeCompare(b.party_code);
            case 'city':
                return (a.city || '').localeCompare(b.city || '');
            case 'gst':
                return (a.gst_number || '').localeCompare(b.gst_number || '');
            default:
                return 0;
        }
    });

    const stats = {
        total: parties.length,
        withGst: parties.filter(p => p.gst_number && p.gst_number.trim() !== '').length,
        withBankDetails: parties.filter(p => p.bank_account && p.bank_account.trim() !== '').length
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Party Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Parties</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-sm text-blue-600 mt-1">Registered Parties</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">With GST</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.withGst}</p>
                    <p className="text-sm text-green-600 mt-1">GST Registered</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">With Bank Details</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.withBankDetails}</p>
                    <p className="text-sm text-purple-600 mt-1">Bank Information</p>
                </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search parties by name, code, GST, city, or address..."
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
                        <option value="name">Sort by Name</option>
                        <option value="code">Sort by Code</option>
                        <option value="city">Sort by City</option>
                        <option value="gst">Sort by GST</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party Code</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Party Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">GST Number</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Address</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">City</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Bank Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedParties.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">No parties found.</td>
                                </tr>
                            ) : (
                                sortedParties.map((party) => (
                                    <tr key={party.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800 font-mono font-semibold">{party.party_code}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{party.party_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 font-mono">{party.gst_number || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 max-w-xs truncate" title={party.address}>
                                            {party.address || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{party.city || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {party.bank_account && party.bank_name ? (
                                                <div>
                                                    <div className="font-medium">{party.bank_name}</div>
                                                    <div className="text-xs text-gray-500">A/c: {party.bank_account}</div>
                                                    {party.ifsc_code && <div className="text-xs text-gray-500">IFSC: {party.ifsc_code}</div>}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Party Statistics */}
            {!isLoading && parties.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Party Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">GST Registered</span>
                                <span className="text-lg font-bold text-green-600">{stats.withGst}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.withGst / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.withGst / stats.total) * 100).toFixed(1)}% of total parties
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">With Bank Details</span>
                                <span className="text-lg font-bold text-purple-600">{stats.withBankDetails}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-purple-500 h-2 rounded-full" 
                                    style={{ width: `${(stats.withBankDetails / stats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((stats.withBankDetails / stats.total) * 100).toFixed(1)}% of total parties
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartyOverviewPage;