// src/pages/Shop.js
import React, { useEffect, useState } from "react";
import ShopCard from "../components/ShopCard";
import { productApi, categoryApi } from "../api/apiService"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner"; // Đảm bảo đường dẫn đúng

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("priceAsc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset lỗi trước khi fetch

        const [productsResult, categoriesResult] = await Promise.all([
          productApi.getProducts(), // Hàm này trả về response.data từ handleResponse
          categoryApi.getCategories() // Tương tự, trả về response.data từ handleResponse
        ]);

        // Xử lý productsResult
        if (Array.isArray(productsResult)) { // Nếu API trả về mảng trực tiếp
          setProducts(productsResult);
        } else if (productsResult && typeof productsResult === 'object' && productsResult.data && Array.isArray(productsResult.data)) { 
          // Nếu API (sau handleResponse) trả về { data: [...] } (ít khả năng hơn với getProducts theo docs)
          setProducts(productsResult.data);
        } else if (productsResult && productsResult.success === true && Array.isArray(productsResult.data) ) {
          // Trường hợp API trả về { success: true, data: [...] } và handleResponse vẫn giữ nguyên cấu trúc này
          setProducts(productsResult.data);
        }
        else {
          // Nếu cấu trúc không như mong đợi hoặc có lỗi logic từ handleResponse mà không throw
          console.error("Unexpected products response structure:", productsResult);
          throw new Error('Failed to process products data');
        }

        // Xử lý categoriesResult (tương tự như productsResult)
        if (Array.isArray(categoriesResult)) {
          setCategories(categoriesResult);
        } else if (categoriesResult && typeof categoriesResult === 'object' && categoriesResult.data && Array.isArray(categoriesResult.data)) {
          setCategories(categoriesResult.data);
        } else if (categoriesResult && categoriesResult.success === true && Array.isArray(categoriesResult.data)) {
          setCategories(categoriesResult.data);
        }
         else {
          console.error("Unexpected categories response structure:", categoriesResult);
          throw new Error('Failed to process categories data');
        }

      } catch (err) {
        // Lỗi từ API call (throw bởi axios interceptor hoặc handleResponse) hoặc throw từ logic trên
        const errorMessage = err.message || 'Failed to fetch data';
        setError(errorMessage);
        // toast.error đã được gọi trong apiService.js interceptor nếu là lỗi API
        // Nếu lỗi là do throw ở đây, bạn có thể toast thêm:
        if (!err.response) { // Chỉ toast nếu không phải lỗi API đã được toast
             toast.error(errorMessage);
        }
        console.error("Fetch data error in Shop.js:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... phần còn lại của component Shop.js (filtering, sorting, rendering) giữ nguyên ...

  // Hiển thị lỗi và nút Retry
  if (loading) {
    return <LoadingSpinner size="large" text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()} // Cách đơn giản nhất để thử lại
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  // ... (JSX cho hiển thị sản phẩm, filter, search)
    const filteredProducts = filterCategory === "all"
    ? products
    : products.filter((product) => {
        // Kiểm tra xem product.category là object hay string
        const categoryIdToCheck = typeof product.category === 'object' && product.category !== null 
                                  ? product.category.id || product.category._id
                                  : product.categoryId; // Giả sử có trường categoryId nếu category không phải object
        return categoryIdToCheck === filterCategory;
    });


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") {
      return a.price - b.price;
    } else if (sortBy === "priceDesc") {
      return b.price - a.price;
    } else if (sortBy === "name") {
      const nameA = a.name || a.title || "";
      const nameB = b.name || b.title || "";
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  const searchedProducts = sortedProducts.filter((product) => {
    const productName = product.name || product.title || "";
    return productName.toLowerCase().includes(searchQuery.toLowerCase())
  }
  );

  return (
    <div className="max-w-screen-xl py-10 mx-auto">
      <div className="flex flex-col items-center gap-4 mb-10">
        <h1 className="text-2xl font-bold">Shop</h1>
        <div className="flex flex-wrap gap-4"> {/* Thêm flex-wrap */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id || category._id} value={category.id || category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>

      {searchedProducts.length === 0 && !loading ? ( // Thêm điều kiện !loading
        <div className="py-10 text-center">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {searchedProducts.map((item) => (
            <ShopCard key={item.id || item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;