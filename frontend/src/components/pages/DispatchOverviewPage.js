import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const DispatchOverviewPage = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [outwardChallans, setOutwardChallans] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [outwardChallansResponse, customersResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/outward-challans`),
                fetch(`${API_BASE_URL}/parties`)
            ]);

            if (!outwardChallansResponse.ok || !customersResponse.ok) {
                throw new Error('Failed to fetch dispatch data');
            }

            const outwardChallansData = await outwardChallansResponse.json();
            const customersData = await customersResponse.json();

            setOutwardChallans(outwardChallansData);
            setCustomers(customersData.filter(party => party.party_type === 'customer'));
        } catch (error) {
            console.error("Error fetching dispatch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getDispatchStats = () => {
        const totalDispatches = outwardChallans.length;
        const totalCustomers = customers.length;
        const thisMonthDispatches = outwardChallans.filter(challan => {
            const challanDate = new Date(challan.challan_date);
            const now = new Date();
            return challanDate.getMonth() === now.getMonth() && 
                   challanDate.getFullYear() === now.getFullYear();
        }).length;
        
        const totalDispatchValue = outwardChallans.reduce((sum, challan) => {
            return sum + (challan.items ? challan.items.reduce((itemSum, item) => 
                itemSum + (item.quantity * item.unit_rate), 0) : 0);
        }, 0);

        return { totalDispatches, totalCustomers, thisMonthDispatches, totalDispatchValue };
    };

    const stats = getDispatchStats();

    const getTopCustomers = () => {
        const customerStats = {};
        
        outwardChallans.forEach(challan => {
            const customerName = challan.customer_name;
            if (!customerStats[customerName]) {
                customerStats[customerName] = { count: 0, value: 0 };
            }
            customerStats[customerName].count++;
            customerStats[customerName].value += challan.items ? 
                challan.items.reduce((sum, item) => sum + (item.quantity * item.unit_rate), 0) : 0;
        });

        return Object.entries(customerStats)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    };

    const topCustomers = getTopCustomers();

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Dispatch Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Dispatches</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalDispatches}</p>
                    <p className="text-sm text-blue-600 mt-1">All Time</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.thisMonthDispatches}</p>
                    <p className="text-sm text-green-600 mt-1">Dispatches</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Customers</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</p>
                    <p className="text-sm text-purple-600 mt-1">Active Customers</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Total Value</h3>
                    <p className="text-3xl font-bold text-orange-600">₹{stats.totalDispatchValue.toLocaleString()}</p>
                    <p className="text-sm text-orange-600 mt-1">Dispatched Value</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Dispatches */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">📤 Recent Dispatches</h3>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : outwardChallans.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No dispatches found.</p>
                    ) : (
                        <div className="space-y-4">
                            {outwardChallans.slice(0, 8).map((challan) => (
                                <div key={challan.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{challan.challan_no}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{challan.customer_name}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(challan.challan_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {challan.items ? challan.items.length : 0} items
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {challan.transport_mode || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {outwardChallans.length > 8 && (
                                <p className="text-center text-sm text-gray-500">
                                    +{outwardChallans.length - 8} more dispatches
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Top Customers */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 Top Customers</h3>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : topCustomers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No customer data available.</p>
                    ) : (
                        <div className="space-y-4">
                            {topCustomers.map((customer, index) => (
                                <div key={customer.name} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                                index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                                                <p className="text-sm text-gray-600">{customer.count} dispatches</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">₹{customer.value.toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">Total Value</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dispatch Metrics */}
            {!isLoading && outwardChallans.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Dispatch Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Average Dispatch Value</span>
                                <span className="text-lg font-bold text-blue-600">
                                    ₹{stats.totalDispatches > 0 ? (stats.totalDispatchValue / stats.totalDispatches).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Per dispatch</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Monthly Average</span>
                                <span className="text-lg font-bold text-green-600">
                                    {stats.totalDispatches > 0 ? Math.round(stats.totalDispatches / 12) : '0'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Dispatches per month</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Customer Engagement</span>
                                <span className="text-lg font-bold text-purple-600">
                                    {stats.totalCustomers > 0 ? ((stats.totalDispatches / stats.totalCustomers) * 100).toFixed(1) : '0'}%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Dispatches per customer</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Transport Mode Distribution */}
            {!isLoading && outwardChallans.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🚚 Transport Mode Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(() => {
                            const transportStats = {};
                            outwardChallans.forEach(challan => {
                                const mode = challan.transport_mode || 'Not Specified';
                                transportStats[mode] = (transportStats[mode] || 0) + 1;
                            });

                            return Object.entries(transportStats).map(([mode, count]) => (
                                <div key={mode} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">{mode}</span>
                                        <span className="text-lg font-bold text-blue-600">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${(count / stats.totalDispatches) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {((count / stats.totalDispatches) * 100).toFixed(1)}% of total
                                    </p>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DispatchOverviewPage;