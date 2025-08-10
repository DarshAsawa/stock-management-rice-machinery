import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const ItemMasterForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [items, setItems] = useState([]);
    
    // Form state variables
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [code, setCode] = useState(''); // Auto-generated, read-only
    const [desc1, setDesc1] = useState('');
    const [desc2, setDesc2] = useState('');
    const [desc3, setDesc3] = useState('');
    const [desc4, setDesc4] = useState('');
    const [desc5, setDesc5] = useState('');
    const [fullDescription, setFullDescription] = useState(''); // Auto-generated from desc1-5
    const [itemName, setItemName] = useState(''); // User can select from full description
    const [stock, setStock] = useState('');
    const [minLevel, setMinLevel] = useState('');
    const [unitRate, setUnitRate] = useState('');
    const [rackBin, setRackBin] = useState('');
    const [uom, setUom] = useState('PC');
    
    // Field labels state (these update based on subcategory)
    const [field1Label, setField1Label] = useState('Description 1');
    const [field2Label, setField2Label] = useState('Description 2');
    const [field3Label, setField3Label] = useState('Description 3');
    const [field4Label, setField4Label] = useState('Description 4');
    const [field5Label, setField5Label] = useState('Description 5');
    
    const [editingItemId, setEditingItemId] = useState(null);
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

    const fetchItemsAndCategories = async () => {
        try {
            setIsLoading(true);
            const [categoriesResponse, subcategoriesResponse, itemsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/categories`),
                fetch(`${API_BASE_URL}/subcategories`),
                fetch(`${API_BASE_URL}/items`)
            ]);

            if (!categoriesResponse.ok || !subcategoriesResponse.ok || !itemsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const categoriesData = await categoriesResponse.json();
            const subcategoriesData = await subcategoriesResponse.json();
            const itemsData = await itemsResponse.json();

            console.log('Fetched data:', {
                categories: categoriesData.length,
                subcategories: subcategoriesData.length,
                items: itemsData.length,
                sampleSubcategory: subcategoriesData[0],
                subcategoryFieldNames: subcategoriesData.map(sub => ({
                    name: sub.subcategory_name,
                    field1: sub.field1_name,
                    field2: sub.field2_name,
                    field3: sub.field3_name,
                    field4: sub.field4_name,
                    field5: sub.field5_name
                }))
            });

            setCategories(categoriesData);
            setSubcategories(subcategoriesData);
            setItems(itemsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setModal({ 
                show: true, 
                title: "⚠️ Data Loading Error", 
                message: "Failed to load data. Please refresh the page and try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItemsAndCategories();
    }, []);

    // Auto-generate item code when category and subcategory are selected
    useEffect(() => {
        if (categoryId && subcategoryId && !editingItemId) {
            generateItemCode(categoryId, subcategoryId);
        }
    }, [categoryId, subcategoryId, editingItemId]);

    // Auto-generate full description from desc1-5
    useEffect(() => {
        const parts = [desc1, desc2, desc3, desc4, desc5].filter(part => part.trim() !== '');
        const generatedDescription = parts.join(' ');
        setFullDescription(generatedDescription);
    }, [desc1, desc2, desc3, desc4, desc5]);

    // Generate item code when category and subcategory are selected
    const generateItemCode = async (categoryId, subcategoryId) => {
        if (!categoryId || !subcategoryId) {
            setCode('');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/items/generate-code/${categoryId}/${subcategoryId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setCode(data.itemCode);
        } catch (error) {
            console.error("Error generating item code:", error);
            setModal({ 
                show: true, 
                title: "❌ Generation Failed", 
                message: "Failed to generate item code. Please try again.", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    // Update field labels when subcategory changes
    useEffect(() => {
        if (subcategoryId) {
            const selectedSubcategory = subcategories.find(sub => parseInt(sub.id) === parseInt(subcategoryId));
            console.log('Updating field labels:', {
                subcategoryId,
                selectedSubcategory,
                allSubcategories: subcategories.map(s => ({ id: s.id, name: s.subcategory_name }))
            });
            if (selectedSubcategory) {
                setField1Label(selectedSubcategory.field1_name || 'Description 1');
                setField2Label(selectedSubcategory.field2_name || 'Description 2');
                setField3Label(selectedSubcategory.field3_name || 'Description 3');
                setField4Label(selectedSubcategory.field4_name || 'Description 4');
                setField5Label(selectedSubcategory.field5_name || 'Description 5');
                console.log('Field labels updated:', {
                    field1: selectedSubcategory.field1_name || 'Description 1',
                    field2: selectedSubcategory.field2_name || 'Description 2',
                    field3: selectedSubcategory.field3_name || 'Description 3',
                    field4: selectedSubcategory.field4_name || 'Description 4',
                    field5: selectedSubcategory.field5_name || 'Description 5'
                });
            }
        }
    }, [subcategoryId, subcategories]);

    // Generate code when category or subcategory changes
    useEffect(() => {
        if (categoryId && subcategoryId) {
            generateItemCode(categoryId, subcategoryId);
        }
    }, [categoryId, subcategoryId]);

    const filteredSubcategories = subcategories.filter(sub => {
        // Convert both to numbers for comparison to handle type mismatches
        const subCategoryId = parseInt(sub.category_id);
        const selectedCategoryId = parseInt(categoryId);
        console.log('Subcategory filtering:', {
            subcategory: sub.subcategory_name,
            subCategoryId,
            selectedCategoryId,
            categoryId,
            matches: subCategoryId === selectedCategoryId
        });
        return subCategoryId === selectedCategoryId;
    });

    const resetForm = () => {
        setCategoryId('');
        setSubcategoryId('');
        setCode('');
        setDesc1('');
        setDesc2('');
        setDesc3('');
        setDesc4('');
        setDesc5('');
        setFullDescription('');
        setItemName('');
        setStock('');
        setMinLevel('');
        setUnitRate('');
        setRackBin('');
        setUom('PC');
        setEditingItemId(null);
        setField1Label('Description 1');
        setField2Label('Description 2');
        setField3Label('Description 3');
        setField4Label('Description 4');
        setField5Label('Description 5');
    };

    const handleEdit = (item) => {
        setEditingItemId(item.id);
        setCategoryId(item.category_id || '');
        setSubcategoryId(item.subcategory_id || '');
        setCode(item.item_code || '');
        setDesc1(item.desc1 || '');
        setDesc2(item.desc2 || '');
        setDesc3(item.desc3 || '');
        setDesc4(item.desc4 || '');
        setDesc5(item.desc5 || '');
        setFullDescription(item.full_description || '');
        setItemName(item.item_name || '');
        setStock(parseFloat(item.stock) || 0);
        setMinLevel(parseFloat(item.min_level) || 0);
        setUnitRate(parseFloat(item.unit_rate) || 0);
        setRackBin(item.rack_bin || '');
        setUom(item.uom || 'PC');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId || !subcategoryId || !code || !itemName || !fullDescription) {
            setModal({ 
                show: true, 
                title: "❌ Validation Error", 
                message: "Please fill in all required fields:\n• Category\n• Subcategory\n• Item Code\n• Item Name\n• Full Description", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        const itemData = {
            categoryId,
            subcategoryId,
            code,
            desc1,
            desc2,
            desc3,
            desc4,
            desc5,
            fullDescription,
            itemName,
            stock,
            minLevel,
            unitRate,
            uom,
            rackBin,
            userId
        };

        setIsLoading(true);

        try {
            let response;
            if (editingItemId) {
                response = await fetch(`${API_BASE_URL}/items/${editingItemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setModal({ 
                show: true, 
                title: "🎉 Success!", 
                message: `Item ${editingItemId ? 'updated' : 'added'} successfully!\n\n✅ Item Code: ${code}\n📦 Item Name: ${itemName}`, 
                type: 'success',
                showConfirmButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchItemsAndCategories();
                }
            });
        } catch (error) {
            console.error("Error saving item:", error);
            setModal({ 
                show: true, 
                title: "❌ Operation Failed", 
                message: `Failed to ${editingItemId ? 'update' : 'save'} item.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id, itemName) => {
        setModal({
            show: true,
            title: "🗑️ Confirm Deletion",
            message: `Are you sure you want to delete item "${itemName}"?\n\n⚠️ This action will:\n• Permanently remove the item\n• May affect related transactions\n• Cannot be undone\n\nProceed with deletion?`,
            type: 'warning',
            showConfirmButton: true,
            autoClose: false,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
                        method: 'DELETE'
                    });
                    
                    // Check if response is ok first
                    if (!response.ok) {
                        // Try to parse JSON, but handle cases where it's not JSON
                        let errorMessage = `HTTP error! status: ${response.status}`;
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (parseError) {
                            // If JSON parsing fails, try to get text response
                            try {
                                const textResponse = await response.text();
                                console.error("Server response:", textResponse);
                                errorMessage = `Server error: ${response.status}. Please check server logs.`;
                            } catch (textError) {
                                console.error("Failed to read response:", textError);
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    // For successful responses, try to parse JSON if there's content
                    let responseData = null;
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            responseData = await response.json();
                        } catch (parseError) {
                            console.warn("Could not parse successful response as JSON:", parseError);
                            // This is okay for successful DELETE operations that return empty body
                        }
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "✅ Item Deleted", 
                        message: `Item "${itemName}" has been successfully deleted.\n\n📊 Item records have been removed from the system.`, 
                        type: 'success',
                        showConfirmButton: false,
                        autoClose: true,
                        autoCloseDelay: 3000,
                        onClose: () => {
                            setModal(prev => ({ ...prev, show: false }));
                            fetchItemsAndCategories();
                        }
                    });
                } catch (error) {
                    console.error("Error deleting item:", error);
                    setModal({ 
                        show: true, 
                        title: "❌ Deletion Failed", 
                        message: `Failed to delete item "${itemName}".\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
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

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Item Master</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category and Subcategory Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <SelectField 
                        label="Category" 
                        id="categoryId" 
                        value={categoryId} 
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setSubcategoryId(''); // Reset subcategory when category changes
                        }} 
                        options={categories.map(cat => ({ value: cat.id, label: cat.category_name }))} 
                        required={true} 
                    />
                    <SelectField 
                        label="Subcategory" 
                        id="subcategoryId" 
                        value={subcategoryId} 
                        onChange={(e) => setSubcategoryId(e.target.value)} 
                        options={filteredSubcategories.map(sub => ({ value: sub.id, label: sub.subcategory_name }))} 
                        required={true} 
                    />
                </div>

                {/* Item Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField 
                        label="Item Code" 
                        id="code" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        required={true} 
                        readOnly={true} 
                        className="bg-gray-100"
                    />
                </div>

                {/* Description Fields 1-5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField 
                        label={field1Label} 
                        id="desc1" 
                        value={desc1} 
                        onChange={(e) => setDesc1(e.target.value)} 
                        placeholder="Enter description"
                    />
                    <InputField 
                        label={field2Label} 
                        id="desc2" 
                        value={desc2} 
                        onChange={(e) => setDesc2(e.target.value)} 
                        placeholder="Enter description"
                    />
                    <InputField 
                        label={field3Label} 
                        id="desc3" 
                        value={desc3} 
                        onChange={(e) => setDesc3(e.target.value)} 
                        placeholder="Enter description"
                    />
                    <InputField 
                        label={field4Label} 
                        id="desc4" 
                        value={desc4} 
                        onChange={(e) => setDesc4(e.target.value)} 
                        placeholder="Enter description"
                    />
                    <InputField 
                        label={field5Label} 
                        id="desc5" 
                        value={desc5} 
                        onChange={(e) => setDesc5(e.target.value)} 
                        placeholder="Enter description"
                    />
                </div>

                {/* Full Description (Auto-generated) */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                    <InputField 
                        label="Full Description" 
                        id="fullDescription" 
                        value={fullDescription} 
                        onChange={(e) => setFullDescription(e.target.value)} 
                        required={true} 
                        placeholder="Auto-generated from fields above (can be edited)"
                        className="bg-blue-50"
                    />
                </div>

                {/* Item Name (User can select from full description) */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                    <InputField 
                        label="Item Name" 
                        id="itemName" 
                        value={itemName} 
                        onChange={(e) => setItemName(e.target.value)} 
                        required={true} 
                        placeholder="Select a portion from the full description above"
                    />
                </div>

                {/* Stock and Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <InputField 
                        label="Stock" 
                        id="stock" 
                        type="number" 
                        value={stock} 
                        onChange={(e) => setStock(parseInt(e.target.value) || 0)} 
                        min="0"
                    />
                    <InputField 
                        label="Minimum Level" 
                        id="minLevel" 
                        type="number" 
                        value={minLevel} 
                        onChange={(e) => setMinLevel(parseInt(e.target.value) || 0)} 
                        min="0"
                    />
                    <InputField 
                        label="Unit Rate" 
                        id="unitRate" 
                        type="number" 
                        step="0.01" 
                        value={unitRate} 
                        onChange={(e) => setUnitRate(parseFloat(e.target.value) || 0)} 
                        min="0"
                    />
                </div>

                {/* UOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <InputField 
                        label="UOM*" 
                        id="uom" 
                        value={uom} 
                        onChange={(e) => setUom(e.target.value)} 
                        required={true} 
                        placeholder="e.g., KG, PC, LTR, etc."
                    />
                </div>

                {/* Rack/Bin Location */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                    <InputField 
                        label="Rack/Bin" 
                        id="rackBin" 
                        value={rackBin} 
                        onChange={(e) => setRackBin(e.target.value)} 
                        placeholder="e.g., A1-B2"
                    />
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>📦</span>
                        {editingItemId ? 'Update Item' : 'Add Item'}
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

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Registered Items</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Code</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Rate</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">UOM</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-4 px-4 text-center text-gray-500">No items registered yet.</td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.item_code}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.item_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.category_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.stock}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">₹{item.unit_rate}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{item.uom}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(item)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(item.id, item.item_name)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2">Delete</Button>
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

export default ItemMasterForm;