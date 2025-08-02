import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductionFloorStockPage = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [productionFloorStock, setProductionFloorStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const fetchProductionFloorStock = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/production-floor-stocks`);
            if (!response.ok) throw new Error('Failed to fetch production floor stock');
            
            const data = await response.json();
            setProductionFloorStock(data);
        } catch (error) {
            console.error("Error fetching production floor stock:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductionFloorStock();
    }, []);

    const filteredStock = productionFloorStock.filter(item => {
        const matchesSearch = item.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || item.category_name === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedStock = [...filteredStock].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.item_description.localeCompare(b.item_description);
            case 'code':
                return a.item_code.localeCompare(b.item_code);
            case 'category':
                return a.category_name.localeCompare(b.category_name);
            case 'quantity':
                return b.quantity - a.quantity;
            case 'value':
                return (b.quantity * b.unit_rate) - (a.quantity * a.unit_rate);
            default:
                return 0;
        }
    });

    const getStockStats = () => {
        const totalItems = productionFloorStock.length;
        const totalQuantity = productionFloorStock.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = productionFloorStock.reduce((sum, item) => sum + (item.quantity * item.unit_rate), 0);
        const lowStockItems = productionFloorStock.filter(item => item.quantity <= 10).length;
        
        return { totalItems, totalQuantity, totalValue, lowStockItems };
    };

    const stats = getStockStats();

    const getCategories = () => {
        const categories = [...new Set(productionFloorStock.map(item => item.category_name))];
        return categories.sort();
    };

    const categories = getCategories();

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Production Floor Stock</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Items</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
                    <p className="text-sm text-blue-600 mt-1">On Production Floor</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Total Quantity</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalQuantity}</p>
                    <p className="text-sm text-green-600 mt-1">Units Available</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Value</h3>
                    <p className="text-3xl font-bold text-purple-600">₹{stats.totalValue.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 mt-1">Floor Stock Value</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Low Stock Items</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.lowStockItems}</p>
                    <p className="text-sm text-yellow-600 mt-1">≤ 10 Units</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search items by description or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="code">Sort by Code</option>
                        <option value="category">Sort by Category</option>
                        <option value="quantity">Sort by Quantity (High to Low)</option>
                        <option value="value">Sort by Value (High to Low)</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Description</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">UOM</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStock.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="py-4 px-4 text-center text-gray-500">No production floor items found.</td>
                                </tr>
                            ) : (
                                sortedStock.map((item) => {
                                    const totalValue = item.quantity * item.unit_rate;
                                    const stockStatus = item.quantity <= 0 ? 'Out of Stock' : 
                                                      item.quantity <= 10 ? 'Low Stock' : 'Available';
                                    const statusColor = item.quantity <= 0 ? 'text-red-600 bg-red-100' :
                                                      item.quantity <= 10 ? 'text-yellow-600 bg-yellow-100' :
                                                      'text-green-600 bg-green-100';
                                    
                                    return (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800 font-mono">{item.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.item_description}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.quantity}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.uom}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">₹{totalValue.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                    {stockStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {new Date(item.updated_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Low Stock Alerts */}
            {!isLoading && stats.lowStockItems > 0 && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚠️ Low Stock Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productionFloorStock
                            .filter(item => item.quantity <= 10)
                            .slice(0, 6)
                            .map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg border border-yellow-300">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.item_description}</p>
                                            <p className="text-sm text-gray-600">{item.item_code}</p>
                                        </div>
                                        <span className="text-red-600 font-bold">{item.quantity} {item.uom}</span>
                                    </div>
                                    <p className="text-xs text-yellow-600 mt-2">
                                        Category: {item.category_name} | Rate: ₹{item.unit_rate}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Category Distribution */}
            {!isLoading && categories.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => {
                            const categoryItems = productionFloorStock.filter(item => item.category_name === category);
                            const categoryQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
                            const categoryValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.unit_rate), 0);
                            
                            return (
                                <div key={category} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{category}</p>
                                            <p className="text-sm text-gray-600">{categoryItems.length} items</p>
                                        </div>
                                        <span className="text-blue-600 font-bold">₹{categoryValue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${(categoryItems.length / stats.totalItems) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {categoryQuantity} units | {((categoryItems.length / stats.totalItems) * 100).toFixed(1)}% of items
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionFloorStockPage;