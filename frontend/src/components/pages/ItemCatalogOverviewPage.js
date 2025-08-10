import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ItemCatalogOverviewPage = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [itemsResponse, categoriesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/items`),
                fetch(`${API_BASE_URL}/categories`)
            ]);

            if (!itemsResponse.ok || !categoriesResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const itemsData = await itemsResponse.json();
            const categoriesData = await categoriesResponse.json();

            setItems(itemsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching item catalog data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.full_description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || item.category_id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.item_name.localeCompare(b.item_name);
            case 'code':
                return a.item_code.localeCompare(b.item_code);
            case 'category':
                return a.category_name.localeCompare(b.category_name);
            case 'stock':
                return b.stock - a.stock;
            case 'rate':
                return b.unit_rate - a.unit_rate;
            default:
                return 0;
        }
    });

    const getCatalogStats = () => {
        const totalItems = items.length;
        const totalCategories = categories.length;
        const totalValue = items.reduce((sum, item) => sum + (item.stock * item.unit_rate), 0);
        const lowStockItems = items.filter(item => item.stock <= item.min_level).length;
        
        return { totalItems, totalCategories, totalValue, lowStockItems };
    };

    const stats = getCatalogStats();

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Item Catalog Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Items</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
                    <p className="text-sm text-blue-600 mt-1">In Catalog</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Categories</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalCategories}</p>
                    <p className="text-sm text-green-600 mt-1">Item Types</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Value</h3>
                    <p className="text-3xl font-bold text-purple-600">₹{stats.totalValue.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 mt-1">Inventory Value</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Low Stock</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.lowStockItems}</p>
                    <p className="text-sm text-yellow-600 mt-1">Needs Attention</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search items by name, code, or description..."
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
                            <option key={category.id} value={category.id}>
                                {category.category_name}
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
                        <option value="stock">Sort by Stock (High to Low)</option>
                        <option value="rate">Sort by Rate (High to Low)</option>
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
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Code</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Min Level</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Rate</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total Value</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedItems.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="py-4 px-4 text-center text-gray-500">No items found.</td>
                                </tr>
                            ) : (
                                sortedItems.map((item) => {
                                    const totalValue = item.stock * item.unit_rate;
                                    const stockStatus = item.stock <= 0 ? 'Out of Stock' : 
                                                      item.stock <= item.min_level ? 'Low Stock' : 'In Stock';
                                    const statusColor = item.stock <= 0 ? 'text-red-600 bg-red-100' :
                                                      item.stock <= item.min_level ? 'text-yellow-600 bg-yellow-100' :
                                                      'text-green-600 bg-green-100';
                                    
                                    return (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800 font-mono">{item.item_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.item_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 max-w-xs truncate" title={item.full_description}>
                                                {item.full_description}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">{item.stock}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">{item.min_level}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-semibold">₹{totalValue.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                    {stockStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Category Distribution */}
            {!isLoading && categories.length > 0 && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => {
                            const categoryItems = items.filter(item => item.category_id === category.id);
                            const categoryValue = categoryItems.reduce((sum, item) => sum + (item.stock * item.unit_rate), 0);
                            
                            return (
                                <div key={category.id} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{category.category_name}</p>
                                            <p className="text-sm text-gray-600">{categoryItems.length} items</p>
                                        </div>
                                        <span className="text-blue-600 font-bold">₹{categoryValue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${(categoryItems.length / items.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {((categoryItems.length / items.length) * 100).toFixed(1)}% of total items
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

export default ItemCatalogOverviewPage;