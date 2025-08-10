import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const StockControlPage = () => {
    const { API_BASE_URL } = useContext(AppContext);
    const [mainStock, setMainStock] = useState([]);
    const [productionFloorStock, setProductionFloorStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('main');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [mainStockResponse, productionFloorResponse, categoriesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/items`),
                fetch(`${API_BASE_URL}/production-floor-stocks`),
                fetch(`${API_BASE_URL}/categories`)
            ]);

            if (!mainStockResponse.ok || !productionFloorResponse.ok || !categoriesResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const mainStockData = await mainStockResponse.json();
            const productionFloorData = await productionFloorResponse.json();
            const categoriesData = await categoriesResponse.json();

            setMainStock(mainStockData);
            setProductionFloorStock(productionFloorData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStockStatus = (stock, minLevel) => {
        if (stock <= 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        if (stock <= minLevel) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
        return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    };

    const filteredMainStock = mainStock.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || item.category_id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredProductionFloorStock = productionFloorStock.filter(item => {
        const matchesSearch = item.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getTotalValue = (items) => {
        return items.reduce((total, item) => {
            const stock = item.stock || item.quantity || 0;
            const rate = item.unit_rate || 0;
            return total + (stock * rate);
        }, 0);
    };

    const getLowStockItems = (items) => {
        return items.filter(item => {
            const stock = item.stock || item.quantity || 0;
            const minLevel = item.min_level || 0;
            return stock <= minLevel;
        });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Stock Control</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Main Stock Items</h3>
                    <p className="text-3xl font-bold text-blue-600">{mainStock.length}</p>
                    <p className="text-sm text-blue-600 mt-1">Total Items</p>
                    <p className="text-sm text-blue-500 mt-2">Value: ₹{getTotalValue(mainStock).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Production Floor</h3>
                    <p className="text-3xl font-bold text-green-600">{productionFloorStock.length}</p>
                    <p className="text-sm text-green-600 mt-1">Active Items</p>
                    <p className="text-sm text-green-500 mt-2">Value: ₹{getTotalValue(productionFloorStock).toLocaleString()}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Low Stock Items</h3>
                    <p className="text-3xl font-bold text-yellow-600">{getLowStockItems(mainStock).length}</p>
                    <p className="text-sm text-yellow-600 mt-1">Needs Attention</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Inventory</h3>
                    <p className="text-3xl font-bold text-purple-600">{mainStock.length + productionFloorStock.length}</p>
                    <p className="text-sm text-purple-600 mt-1">All Items</p>
                    <p className="text-sm text-purple-500 mt-2">Value: ₹{(getTotalValue(mainStock) + getTotalValue(productionFloorStock)).toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    onClick={() => setActiveTab('main')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'main' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Main Stock
                </button>
                <button
                    onClick={() => setActiveTab('production')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'production' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Production Floor
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {activeTab === 'main' && (
                    <div className="w-full md:w-64">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    {activeTab === 'main' ? (
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Min Level</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">UOM</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMainStock.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-4 px-4 text-center text-gray-500">No items found.</td>
                                    </tr>
                                ) : (
                                    filteredMainStock.map((item) => {
                                        const stockStatus = getStockStatus(item.stock, item.min_level);
                                        const totalValue = (item.stock || 0) * (item.unit_rate || 0);
                                        
                                        return (
                                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-800 font-mono">{item.item_code}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.item_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.stock}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.min_level}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.uom}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">₹{totalValue.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                        {stockStatus.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    ) : (
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
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProductionFloorStock.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-4 px-4 text-center text-gray-500">No production floor items found.</td>
                                    </tr>
                                ) : (
                                    filteredProductionFloorStock.map((item) => {
                                        const totalValue = (item.quantity || 0) * (item.unit_rate || 0);
                                        
                                        return (
                                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-800 font-mono">{item.item_code}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.item_description}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.quantity}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">{item.uom}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800 font-semibold">₹{totalValue.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-sm text-gray-800">
                                                    {new Date(item.updated_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Stock Alerts */}
            {activeTab === 'main' && getLowStockItems(mainStock).length > 0 && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚠️ Low Stock Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getLowStockItems(mainStock).slice(0, 6).map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-yellow-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.item_name}</p>
                                        <p className="text-sm text-gray-600">{item.item_code}</p>
                                    </div>
                                    <span className="text-red-600 font-bold">{item.stock}</span>
                                </div>
                                <p className="text-xs text-yellow-600 mt-2">
                                    Min Level: {item.min_level} | Current: {item.stock}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockControlPage;