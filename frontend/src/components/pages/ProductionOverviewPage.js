import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductionOverviewPage = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [issueNotes, setIssueNotes] = useState([]);
    const [inwardInternals, setInwardInternals] = useState([]);
    const [productionFloorStock, setProductionFloorStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [issueNotesResponse, inwardInternalsResponse, productionFloorResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/issue-notes-internal`),
                fetch(`${API_BASE_URL}/inward-internals`),
                fetch(`${API_BASE_URL}/production-floor-stocks`)
            ]);

            if (!issueNotesResponse.ok || !inwardInternalsResponse.ok || !productionFloorResponse.ok) {
                throw new Error('Failed to fetch production data');
            }

            const issueNotesData = await issueNotesResponse.json();
            const inwardInternalsData = await inwardInternalsResponse.json();
            const productionFloorData = await productionFloorResponse.json();

            setIssueNotes(issueNotesData);
            setInwardInternals(inwardInternalsData);
            setProductionFloorStock(productionFloorData);
        } catch (error) {
            console.error("Error fetching production data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getProductionStats = () => {
        const totalIssues = issueNotes.length;
        const totalInwards = inwardInternals.length;
        const totalProductionItems = productionFloorStock.length;
        const totalProductionValue = productionFloorStock.reduce((sum, item) => sum + (item.quantity * item.unit_rate), 0);
        
        return { totalIssues, totalInwards, totalProductionItems, totalProductionValue };
    };

    const stats = getProductionStats();

    const getRecentActivities = () => {
        const activities = [];
        
        // Add recent issue notes
        issueNotes.slice(0, 5).forEach(issue => {
            activities.push({
                id: `issue-${issue.id}`,
                type: 'issue',
                title: `Issue Note: ${issue.issue_no}`,
                description: `Issued to ${issue.department} by ${issue.issued_by}`,
                date: issue.issue_date,
                color: 'bg-blue-100 text-blue-800'
            });
        });

        // Add recent inwards
        inwardInternals.slice(0, 5).forEach(inward => {
            activities.push({
                id: `inward-${inward.id}`,
                type: 'inward',
                title: `Production Complete: ${inward.receipt_no || 'N/A'}`,
                description: `Received by ${inward.received_by} in ${inward.department}`,
                date: inward.received_date,
                color: 'bg-green-100 text-green-800'
            });
        });

        // Sort by date (most recent first)
        return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    };

    const recentActivities = getRecentActivities();

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Production Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Issues</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalIssues}</p>
                    <p className="text-sm text-blue-600 mt-1">Material Issues</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Production Completions</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalInwards}</p>
                    <p className="text-sm text-green-600 mt-1">Finished Goods</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Production Floor Items</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalProductionItems}</p>
                    <p className="text-sm text-purple-600 mt-1">Active Items</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Production Value</h3>
                    <p className="text-3xl font-bold text-orange-600">₹{stats.totalProductionValue.toLocaleString()}</p>
                    <p className="text-sm text-orange-600 mt-1">Floor Stock Value</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">🔄 Recent Production Activities</h3>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : recentActivities.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No recent activities found.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                                            {activity.type === 'issue' ? 'Issue' : 'Complete'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Production Floor Stock */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">🏭 Production Floor Stock</h3>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : productionFloorStock.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No production floor items found.</p>
                    ) : (
                        <div className="space-y-3">
                            {productionFloorStock.slice(0, 8).map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.item_description}</h4>
                                            <p className="text-sm text-gray-600">{item.item_code}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{item.quantity} {item.uom}</p>
                                            <p className="text-sm text-gray-600">₹{item.unit_rate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {productionFloorStock.length > 8 && (
                                <p className="text-center text-sm text-gray-500">
                                    +{productionFloorStock.length - 8} more items
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Production Metrics */}
            {!isLoading && (issueNotes.length > 0 || inwardInternals.length > 0) && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Production Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">This Month Issues</span>
                                <span className="text-lg font-bold text-blue-600">
                                    {issueNotes.filter(issue => {
                                        const issueDate = new Date(issue.issue_date);
                                        const now = new Date();
                                        return issueDate.getMonth() === now.getMonth() && 
                                               issueDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Material issues to production</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">This Month Completions</span>
                                <span className="text-lg font-bold text-green-600">
                                    {inwardInternals.filter(inward => {
                                        const inwardDate = new Date(inward.received_date);
                                        const now = new Date();
                                        return inwardDate.getMonth() === now.getMonth() && 
                                               inwardDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Production completions</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Efficiency Ratio</span>
                                <span className="text-lg font-bold text-purple-600">
                                    {stats.totalInwards > 0 && stats.totalIssues > 0 
                                        ? ((stats.totalInwards / stats.totalIssues) * 100).toFixed(1)
                                        : '0'}%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Completions per issue</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionOverviewPage;