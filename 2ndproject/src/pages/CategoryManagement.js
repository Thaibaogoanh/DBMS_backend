import React, { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../api/apiService'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner'; // Đảm bảo đường dẫn đúng
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'; // Thêm icons

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        parentId: '' // Sử dụng chuỗi rỗng cho select_value, sẽ chuyển thành null khi gửi
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(false); // Để ẩn/hiện form
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái cho nút submit

    const resetForm = useCallback(() => {
        setSelectedCategory(null);
        setFormData({
            name: '',
            description: '',
            image: '',
            parentId: ''
        });
        setFormVisible(false); // Ẩn form sau khi reset hoặc cancel
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryApi.getCategories();
            // categoryApi.getCategories trả về mảng trực tiếp (sau khi qua handleResponse)
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.warn("Unexpected data structure from getCategories:", data);
                setCategories([]);
                // toast.error('Could not parse categories data.'); // Không cần thiết nếu apiService đã toast
            }
        } catch (err) {
            // Lỗi đã được toast bởi interceptor trong apiService.js
            setError(err.message || 'Failed to load categories.');
            setCategories([]); // Đảm bảo categories là mảng khi có lỗi
            console.error("Error loading categories:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "parentId" && value === "" ? null : value // Chuyển parentId rỗng thành null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); // Reset lỗi form cũ

        const payload = {
            ...formData,
            parentId: formData.parentId === '' ? null : formData.parentId, // Đảm bảo parentId là null nếu không chọn
        };

        try {
            let response;
            if (selectedCategory) {
                response = await categoryApi.updateCategory(selectedCategory.id || selectedCategory._id, payload);
            } else {
                response = await categoryApi.createCategory(payload);
            }

            // API 3.4 và 3.5 trả về { message: "...", category: {...} }
            if (response && response.category) {
                toast.success(response.message || `Category ${selectedCategory ? 'updated' : 'created'} successfully`);
                loadCategories(); // Tải lại danh sách
                resetForm();    // Reset và ẩn form
            } else {
                // Trường hợp response không có 'category' nhưng không phải lỗi API (đã được interceptor bắt)
                toast.error(response?.message || 'An unexpected issue occurred.');
            }
        } catch (error) {
            // Lỗi đã được toast bởi interceptor trong apiService.js
            // setError(error.message || 'Operation failed'); // Hiển thị lỗi cụ thể cho form nếu cần
            console.error("Error submitting category:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || '',
            image: category.image || '',
            parentId: category.parentId || '' // Nếu parentId là null, select sẽ hiển thị "None"
        });
        setFormVisible(true); // Hiển thị form để edit
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete/deactivate this category? This might affect products using it.')) {
            try {
                // API 3.6 trả về { message: "..." }
                const response = await categoryApi.deleteCategory(id);
                if (response && response.message) {
                    toast.success(response.message);
                    loadCategories(); // Tải lại danh sách
                } else {
                    toast.error(response?.message || 'Failed to delete category.');
                }
            } catch (error) {
                // Lỗi đã được toast bởi interceptor trong apiService.js
                // API 3.6 có thể trả về 400 Bad Request nếu còn sản phẩm/danh mục con active
                // Interceptor sẽ hiển thị toast.error(error.response.data.message)
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleAddNew = () => {
        resetForm();
        setFormVisible(true);
    };

    const getCategoryNameById = (id) => {
        if (!id) return 'N/A';
        const parent = categories.find(c => (c.id || c._id) === id);
        return parent ? parent.name : 'Unknown (ID: ' + id + ')';
    };


    if (loading && !categories.length) { // Chỉ hiển thị loading toàn trang khi chưa có data
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner text="Loading categories..." size="large" />
            </div>
        );
    }

    if (error && !categories.length) {
        return (
            <div className="container px-4 py-8 mx-auto text-center">
                <p className="text-xl text-red-500">{error}</p>
                <button onClick={loadCategories} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Category Management</h1>
                {!formVisible && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                        <FaPlus className="mr-2" /> Add New Category
                    </button>
                )}
            </div>

            {/* Category Form - Toggleable */}
            {formVisible && (
                <form onSubmit={handleSubmit} className="p-6 mb-8 bg-white rounded-lg shadow-xl"> {/* Tăng shadow */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            {selectedCategory ? 'Edit Category' : 'Create New Category'}
                        </h2>
                        <button type="button" onClick={resetForm} className="text-gray-500 hover:text-red-600">
                            <FaTimes size={20}/>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                            <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent Category</label>
                            <select id="parentId" name="parentId" value={formData.parentId || ''} onChange={handleInputChange}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">None (Root Category)</option>
                                {categories.filter(c => !selectedCategory || (c.id || c._id) !== (selectedCategory.id || selectedCategory._id)).map(category => ( // Loại bỏ category hiện tại khỏi list parent
                                    <option key={category.id || category._id} value={category.id || category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="3"
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input id="image" type="text" name="image" value={formData.image} onChange={handleInputChange}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            {formData.image && <img src={formData.image} alt="Preview" className="object-cover mt-2 rounded h-14 w-14" />}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-8">
                        <button type="button" onClick={resetForm}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                            {isSubmitting ? <LoadingSpinner size="small" text="" /> : (selectedCategory ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            )}

            {/* Categories List */}
            {loading && categories.length > 0 && <div className="py-4 text-center"><LoadingSpinner text="Refreshing categories..." /></div>}
            
            {!loading && categories.length === 0 && !error && (
                 <div className="p-6 text-center bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-600">No categories found. Click "Add New Category" to get started!</p>
                </div>
            )}

            {categories.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Parent</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.id || category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {category.image ? (
                                            <img src={category.image} alt={category.name} className="object-cover w-10 h-10 rounded" />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 text-gray-400 bg-gray-100 rounded">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                    </td>
                                    <td className="max-w-xs px-6 py-4 text-sm text-gray-500 truncate" title={category.description}>
                                        {category.description || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {getCategoryNameById(category.parentId)}
                                    </td>
                                    <td className="px-6 py-4 space-x-2 text-center whitespace-nowrap">
                                        <button onClick={() => handleEdit(category)} title="Edit"
                                            className="p-2 text-indigo-600 rounded-md hover:bg-indigo-100 hover:text-indigo-900">
                                            <FaEdit size={16}/>
                                        </button>
                                        <button onClick={() => handleDelete(category.id || category._id)} title="Delete"
                                            className="p-2 text-red-600 rounded-md hover:bg-red-100 hover:text-red-900">
                                            <FaTrash size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;