import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';

const DashboardPage = ({ userId, setCurrentPage }) => {
    const { API_BASE_URL } = useContext(AppContext);
    const [dashboardStats, setDashboardStats] = useState({});
    const [stockData, setStockData] = useState([]);
    const [recentGateInwards, setRecentGateInwards] = useState([]);
    const [recentOutwardChallans, setRecentOutwardChallans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, title: '', message: '', showConfirmButton: false, onConfirm: null });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data in parallel
                const [statsResponse, itemsResponse, gateInwardsResponse, outwardChallansResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/dashboard-stats`),
                    fetch(`${API_BASE_URL}/items`),
                    fetch(`${API_BASE_URL}/gate-inwards`),
                    fetch(`${API_BASE_URL}/outward-challans`)
                ]);

                if (!statsResponse.ok || !itemsResponse.ok || !gateInwardsResponse.ok || !outwardChallansResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const [statsData, itemsData, gateInwardsData, outwardChallansData] = await Promise.all([
                    statsResponse.json(),
                    itemsResponse.json(),
                    gateInwardsResponse.json(),
                    outwardChallansResponse.json()
                ]);

                setDashboardStats(statsData);
                setStockData(itemsData);
                setRecentGateInwards(gateInwardsData.slice(0, 5));
                setRecentOutwardChallans(outwardChallansData.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setModal({ 
                    show: true, 
                    title: "Error", 
                    message: "Failed to load dashboard data. Please try again.", 
                    onClose: () => setModal({ ...modal, show: false }) 
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [API_BASE_URL]);

    // Calculate stock analytics
    const stockAnalytics = {
        totalItems: stockData.length,
        lowStockItems: stockData.filter(item => (item.stock || 0) <= (item.min_level || 0)).length,
        outOfStockItems: stockData.filter(item => (item.stock || 0) === 0).length,
        topItems: stockData
            .sort((a, b) => (b.stock || 0) - (a.stock || 0))
            .slice(0, 5)
            .map(item => ({
                name: item.item_name,
                stock: item.stock || 0,
                code: item.item_code
            }))
    };

    // Bar chart component for stock visualization
    const StockBarChart = ({ items, title, maxBars = 5 }) => {
        const maxStock = Math.max(...items.map(item => item.stock), 1);
        
        return (
            <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
                <div className="space-y-2">
                    {items.slice(0, maxBars).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="w-32 text-xs text-gray-600 truncate" title={item.name}>
                                {item.name}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${(item.stock / maxStock) * 100}%` }}
                                ></div>
                            </div>
                            <div className="w-12 text-xs text-gray-600 text-right">
                                {item.stock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Analytics card component
    const AnalyticsCard = ({ title, value, subtitle, icon, color = "blue" }) => (
        <div className={`bg-${color}-50 p-6 rounded-lg border border-${color}-200`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6">
                <h3 className="text-3xl font-extrabold text-gray-800 border-b-2 border-blue-500 pb-2">
                    DASHBOARD
                </h3>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AnalyticsCard 
                    title="Total Parties" 
                    value={dashboardStats.totalParties || 0} 
                    subtitle="Registered parties"
                    icon="👥"
                    color="blue"
                />
                <AnalyticsCard 
                    title="Total Items" 
                    value={stockAnalytics.totalItems} 
                    subtitle="In catalog"
                    icon="📦"
                    color="green"
                />
                <AnalyticsCard 
                    title="Low Stock Items" 
                    value={stockAnalytics.lowStockItems} 
                    subtitle="Need attention"
                    icon="⚠️"
                    color="red"
                />
            </div>

            {/* Stock Analytics with Bar Charts */}
            <div className="mb-8">
                <StockBarChart 
                    items={stockAnalytics.topItems} 
                    title="Top 5 Items by Stock Level" 
                    maxBars={5}
                />
            </div>

            {/* Recent Entries Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Gate Inwards */}
                <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">📥</span>
                            Recent Gate Inwards
                        </h3>
                    </div>
                    <div className="p-4">
                        {recentGateInwards.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent gate inward entries</p>
                        ) : (
                            <div className="space-y-3">
                                {recentGateInwards.map((entry) => (
                                    <div key={entry.id} className="border-l-4 border-green-500 pl-3 py-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-800">
                                                    {entry.grn_number}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {entry.supplier_name} • {new Date(entry.grn_date).toLocaleDateString()}
                                                </p>
                                                {entry.items && entry.items.length > 0 && (
                                                    <div className="mt-1">
                                                        {entry.items.slice(0, 2).map((item, idx) => (
                                                            <p key={idx} className="text-xs text-gray-500">
                                                                {item.item_name} ({item.quantity} {item.uom})
                                                            </p>
                                                        ))}
                                                        {entry.items.length > 2 && (
                                                            <p className="text-xs text-gray-400">
                                                                +{entry.items.length - 2} more items
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                                                {entry.items ? entry.items.length : 0} items
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Outward Challans */}
                <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">📤</span>
                            Recent Outward Challans
                        </h3>
                    </div>
                    <div className="p-4">
                        {recentOutwardChallans.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent outward challan entries</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOutwardChallans.map((entry) => (
                                    <div key={entry.id} className="border-l-4 border-blue-500 pl-3 py-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-800">
                                                    {entry.challan_no}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {entry.party_name} • {new Date(entry.challan_date).toLocaleDateString()}
                                                </p>
                                                {entry.items && entry.items.length > 0 && (
                                                    <div className="mt-1">
                                                        {entry.items.slice(0, 2).map((item, idx) => (
                                                            <p key={idx} className="text-xs text-gray-500">
                                                                {item.item_name} ({item.quantity} {item.uom})
                                                            </p>
                                                        ))}
                                                        {entry.items.length > 2 && (
                                                            <p className="text-xs text-gray-400">
                                                                +{entry.items.length - 2} more items
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                                                {entry.items ? entry.items.length : 0} items
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setCurrentPage('partyOverview')}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center"
                    >
                        <div className="text-2xl mb-2">👥</div>
                        <div className="text-sm font-medium text-gray-700">Party Management</div>
                    </button>
                    <button
                        onClick={() => setCurrentPage('itemCatalog')}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center"
                    >
                        <div className="text-2xl mb-2">📦</div>
                        <div className="text-sm font-medium text-gray-700">Item Catalog</div>
                    </button>
                    <button
                        onClick={() => setCurrentPage('recordedEntries')}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center"
                    >
                        <div className="text-2xl mb-2">📋</div>
                        <div className="text-sm font-medium text-gray-700">All Entries</div>
                    </button>
                    <button
                        onClick={() => setCurrentPage('stockControl')}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm font-medium text-gray-700">Stock Control</div>
                    </button>
                </div>
            </div>

            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                onClose={modal.onClose}
                onConfirm={modal.onConfirm}
                showConfirmButton={modal.showConfirmButton}
            />
        </div>
    );
};

export default DashboardPage; 