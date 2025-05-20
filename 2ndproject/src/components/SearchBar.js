// src/components/SearchBar.js
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } // Thêm useDispatch
    from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom"; // Để link đến sản phẩm
import { searchProducts } // Import action
    from "../redux/actions/productActions"; // Đường dẫn tới productActions.js
import LoadingSpinner from "./LoadingSpinner"; // Spinner cho trạng thái loading

const SearchBar = () => {
    const dispatch = useDispatch(); // Khởi tạo dispatch
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);

    // Lấy kết quả tìm kiếm và trạng thái loading từ productSearchReducer
    const { products: searchResults, loading: searchLoading, error: searchError } = useSelector(
        (state) => state.productSearch
    );

    useEffect(() => {
        // Sử dụng debounce để tránh gọi API liên tục
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                dispatch(searchProducts(searchTerm)); // Dispatch action tìm kiếm
            }
        }, 500); // Delay 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        setSearchTerm("");
        setIsFocused(false);
        // Có thể dispatch action để clear searchResults trong redux nếu muốn
    };

    const handleResultClick = () => {
        setIsFocused(false); // Ẩn dropdown khi click vào kết quả
        setSearchTerm(""); // Clear ô tìm kiếm
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative">
                {/* ... input và icons như cũ ... */}
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-12 pr-10 text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <FiSearch className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                >
                    <FiX className="text-xl" />
                </button>
                )}
            </div>

            {isFocused && searchTerm && (
                <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-96">
                    {searchLoading && <div className="p-4 text-center"><LoadingSpinner text="Searching..." /></div>}
                    {searchError && <div className="p-4 text-center text-red-500">{searchError}</div>}
                    {!searchLoading && !searchError && searchResults.length > 0 && (
                        <div className="py-2">
                            {searchResults.map((product) => (
                                <Link
                                    key={product._id || product.id} // Sử dụng ID thực tế
                                    to={`/product/${product._id || product.id}`}
                                    onClick={handleResultClick}
                                    className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product.image}
                                            alt={product.name || product.title}
                                            className="object-cover w-12 h-12 rounded"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {product.name || product.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {!searchLoading && !searchError && searchResults.length === 0 && searchTerm && (
                        <div className="p-4 text-center text-gray-500">
                            No products found for "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;