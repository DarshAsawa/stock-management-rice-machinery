import React, { useState, useEffect, useContext } from 'react';
import { AppContext, API_BASE_URL } from '../../context/AppContext';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const SubcategoryManagerForm = () => {
    const { API_BASE_URL, userId } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [field1Name, setField1Name] = useState('Description 1');
    const [field2Name, setField2Name] = useState('Description 2');
    const [field3Name, setField3Name] = useState('Description 3');
    const [field4Name, setField4Name] = useState('Description 4');
    const [field5Name, setField5Name] = useState('Description 5');
    const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Updated modal state structure to match ItemMasterForm
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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [categoriesResponse, subcategoriesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/categories`),
                fetch(`${API_BASE_URL}/subcategories`)
            ]);

            if (!categoriesResponse.ok || !subcategoriesResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const categoriesData = await categoriesResponse.json();
            const subcategoriesData = await subcategoriesResponse.json();

            setCategories(categoriesData);
            setSubcategories(subcategoriesData);
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
        fetchData();
    }, []);

    const resetForm = () => {
        setCategoryId('');
        setSubcategoryName('');
        setField1Name('Description 1');
        setField2Name('Description 2');
        setField3Name('Description 3');
        setField4Name('Description 4');
        setField5Name('Description 5');
        setEditingSubcategoryId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!categoryId || !subcategoryName) {
            setModal({ 
                show: true, 
                title: "❌ Validation Error", 
                message: "Please fill in all required fields:\n• Category\n• Subcategory Name", 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        const subcategoryData = {
            categoryId,
            subcategoryName,
            field1Name,
            field2Name,
            field3Name,
            field4Name,
            field5Name,
            userId
        };

        try {
            let response;
            if (editingSubcategoryId) {
                response = await fetch(`${API_BASE_URL}/subcategories/${editingSubcategoryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subcategoryData)
                });
            } else {
                response = await fetch(`${API_BASE_URL}/subcategories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subcategoryData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setModal({ 
                show: true, 
                title: "🎉 Success!", 
                message: `Subcategory ${editingSubcategoryId ? 'updated' : 'added'} successfully!\n\n✅ Subcategory Name: ${subcategoryName}\n🏷️ Category: ${categories.find(cat => cat.id == categoryId)?.category_name || 'N/A'}`, 
                type: 'success',
                showConfirmButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                onClose: () => {
                    setModal(prev => ({ ...prev, show: false }));
                    resetForm();
                    fetchData();
                }
            });
        } catch (error) {
            console.error("Error saving subcategory:", error);
            setModal({ 
                show: true, 
                title: "❌ Operation Failed", 
                message: `Failed to ${editingSubcategoryId ? 'update' : 'save'} subcategory.\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
                type: 'error',
                showConfirmButton: false,
                autoClose: false,
                onClose: () => setModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const handleEdit = (subcategory) => {
        setEditingSubcategoryId(subcategory.id);
        setCategoryId(subcategory.category_id);
        setSubcategoryName(subcategory.subcategory_name);
        setField1Name(subcategory.field1_name || 'Description 1');
        setField2Name(subcategory.field2_name || 'Description 2');
        setField3Name(subcategory.field3_name || 'Description 3');
        setField4Name(subcategory.field4_name || 'Description 4');
        setField5Name(subcategory.field5_name || 'Description 5');
    };

    const handleDelete = (id, subcategoryName) => {
        setModal({
            show: true,
            title: "🗑️ Confirm Deletion",
            message: `Are you sure you want to delete subcategory "${subcategoryName}"?\n\n⚠️ This action will:\n• Permanently remove the subcategory\n• May affect related items\n• Cannot be undone\n\nProceed with deletion?`,
            type: 'warning',
            showConfirmButton: true,
            autoClose: false,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    setModal({ 
                        show: true, 
                        title: "✅ Subcategory Deleted", 
                        message: `Subcategory "${subcategoryName}" has been successfully deleted.\n\n📊 Subcategory records have been removed from the system.`, 
                        type: 'success',
                        showConfirmButton: false,
                        autoClose: true,
                        autoCloseDelay: 3000,
                        onClose: () => {
                            setModal(prev => ({ ...prev, show: false }));
                            fetchData();
                        }
                    });
                } catch (error) {
                    console.error("Error deleting subcategory:", error);
                    setModal({ 
                        show: true, 
                        title: "❌ Deletion Failed", 
                        message: `Failed to delete subcategory "${subcategoryName}".\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`, 
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
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Subcategory Manager</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <SelectField 
                    label="Category*" 
                    id="categoryId" 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)} 
                    options={categories.map(cat => ({ value: cat.id, label: cat.category_name }))} 
                    required={true} 
                />
                <InputField 
                    label="Subcategory Name*" 
                    id="subcategoryName" 
                    value={subcategoryName} 
                    onChange={(e) => setSubcategoryName(e.target.value)} 
                    required={true} 
                    placeholder="e.g., Electrical"
                />
                <InputField 
                    label="Field 1 Name" 
                    id="field1Name" 
                    value={field1Name} 
                    onChange={(e) => setField1Name(e.target.value)} 
                    placeholder="e.g., Component Type"
                />
                <InputField 
                    label="Field 2 Name" 
                    id="field2Name" 
                    value={field2Name} 
                    onChange={(e) => setField2Name(e.target.value)} 
                    placeholder="e.g., Specification"
                />
                <InputField 
                    label="Field 3 Name" 
                    id="field3Name" 
                    value={field3Name} 
                    onChange={(e) => setField3Name(e.target.value)} 
                    placeholder="e.g., Power Rating"
                />
                <InputField 
                    label="Field 4 Name" 
                    id="field4Name" 
                    value={field4Name} 
                    onChange={(e) => setField4Name(e.target.value)} 
                    placeholder="e.g., Voltage"
                />
                <InputField 
                    label="Field 5 Name" 
                    id="field5Name" 
                    value={field5Name} 
                    onChange={(e) => setField5Name(e.target.value)} 
                    placeholder="e.g., Brand"
                />

                {/* Form Action Buttons */}
                <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
                    <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        <span>🏷️</span>
                        {editingSubcategoryId ? 'Update Subcategory' : 'Add Subcategory'}
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

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4 border-b-2 border-blue-400 pb-2">Registered Subcategories</h3>
            {isLoading ? <LoadingSpinner /> : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Subcategory</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field Names</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No subcategories registered yet.</td>
                                </tr>
                            ) : (
                                subcategories.map((subcategory) => (
                                    <tr key={subcategory.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{subcategory.category_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{subcategory.subcategory_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <div className="text-xs">
                                                <div>{subcategory.field1_name}</div>
                                                <div>{subcategory.field2_name}</div>
                                                <div>{subcategory.field3_name}</div>
                                                <div>{subcategory.field4_name}</div>
                                                <div>{subcategory.field5_name}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <Button onClick={() => handleEdit(subcategory)} className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 mr-2">Edit</Button>
                                            <Button onClick={() => handleDelete(subcategory.id, subcategory.subcategory_name)} className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2">Delete</Button>
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

export default SubcategoryManagerForm;