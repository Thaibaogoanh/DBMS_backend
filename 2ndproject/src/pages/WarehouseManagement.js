import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import { productApi, categoryApi } from "../api/apiService";
export const WarehouseManagement = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((store) => store.bazar.userInfo);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("add");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    quantity: "",
    description: "",
    category: "",
    image: "",
    isNew: false
  });

  // Check if user is admin
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [userInfo, navigate]);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Open form for adding a new product
  const handleAddProduct = () => {
    setFormMode("add");
    setFormData({
      title: "",
      price: "",
      oldPrice: "",
      quantity: "",
      description: "",
      category: "",
      image: "",
      isNew: false
    });
    setIsShowForm(true);
  };

  // Open form for editing an existing product
  const handleEditProduct = (product) => {
    setFormMode("edit");
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice || product.price * 1.2,
      quantity: product.quantity || 10,
      description: product.description,
      category: product.category,
      image: product.image,
      isNew: product.isNew || false
    });
    setIsShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formMode === "add") {
        const newProduct = await productApi.createProduct(formData);
        setProducts([...products, newProduct]);
        toast.success("Product added successfully!");
      } else {
        const updatedProduct = await productApi.updateProduct(currentProduct.id, formData);
        const updatedProducts = products.map(product =>
          product.id === currentProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        toast.success("Product updated successfully!");
      }

      // Reset form
      setIsShowForm(false);
      setFormData({
        title: "",
        price: "",
        oldPrice: "",
        quantity: "",
        description: "",
        category: "",
        image: "",
        isNew: false
      });
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(productId);
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  useEffect(() => {
    const fetchCategoriesForForm = async () => {
      try {
        const response = await categoryApi.getCategories();
        // Giả sử response là mảng các categories theo API docs 3.1
        // Hoặc nếu response có dạng { success: true, data: [...] } thì lấy response.data
        if (Array.isArray(response)) {
          setCategories(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response && response.success && Array.isArray(response.data)) {
          setCategories(response.data);
        }
        else {
          setCategories(response || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories for form", error);
        toast.error("Could not load categories for product form.");
      }
    };
    fetchCategoriesForForm();
    // Thêm fetchProducts vào đây nếu nó chưa được gọi trong useEffect riêng
    // fetchProducts(); // Đã có useEffect riêng cho fetchProducts
  }, []); // Dependency array rỗng để chỉ chạy 1 lần

  return (
    <>
      <section className="bg-white py-10 lg:py-[80px] overflow-hidden relative z-10 p-5">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Warehouse Management</h1>
              <p className="mt-2 text-gray-600">Manage your products inventory</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="px-6 py-2 text-white transition bg-blue-800 rounded-md hover:bg-blue-700"
            >
              Add New Product
            </button>
          </div>

          {/* Product Form (Add/Edit) */}
          {isShowForm && (
            <div className="p-6 mb-10 bg-white rounded-lg shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">{formMode === "add" ? "Add New Product" : "Edit Product"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-gray-700">Product Name</label>
                    <WarehouseInputBox
                      type="text"
                      name="title"
                      placeholder="Product Name"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId || formData.category}
                      onChange={handleInputChange}
                      className="border w-full rounded border-gray-300 py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id || cat._id} value={cat.id || cat._id}> {/* Gửi ID của category */}
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Current Price ($)</label>
                    <WarehouseInputBox
                      type="number"
                      name="price"
                      placeholder="Current Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Old Price ($)</label>
                    <WarehouseInputBox
                      type="number"
                      name="oldPrice"
                      placeholder="Old Price (Optional)"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Stock Quantity</label>
                    <WarehouseInputBox
                      type="number"
                      name="quantity"
                      placeholder="Quantity in Stock"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Image URL</label>
                    <WarehouseInputBox
                      type="text"
                      name="image"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-gray-700">Product Description</label>
                    <WarehouseTextArea
                      row="4"
                      name="description"
                      placeholder="Product Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 form-checkbox"
                      />
                      <span className="ml-2 text-gray-700">Mark as New (Sale)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 text-white transition bg-blue-800 rounded-md hover:bg-blue-700"
                  >
                    {formMode === "add" ? "Add Product" : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShowForm(false)}
                    className="px-6 py-2 text-gray-800 transition bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Image</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Product Name</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Category</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Price</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Stock</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <img src={product.image} alt={product.title} className="object-cover w-12 h-12" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500">{typeof product.category === 'object' && product.category !== null ? product.category.name : product.category}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">${product.price}</div>
                        {product.oldPrice && <div className="text-xs text-gray-500 line-through">${product.oldPrice}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{product.quantity || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default WarehouseManagement;

const WarehouseTextArea = ({ row, placeholder, name, value, onChange, required }) => {
  return (
    <>
      <div className="mb-6">
        <textarea
          rows={row}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border-gray-300 w-full resize-none rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
        />
      </div>
    </>
  );
};

const WarehouseInputBox = ({ type, placeholder, name, value, onChange, required }) => {
  return (
    <>
      <div className="mb-6">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border-gray-300 w-full rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
        />
      </div>
    </>
  );
};
