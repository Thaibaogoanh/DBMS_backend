// src/components/ShopCard.js
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/bazarSlice"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import { BsCartPlus } from "react-icons/bs"; // Icon giỏ hàng

const ShopCard = ({ product }) => {
    const dispatch = useDispatch();

    if (!product) { // Thêm kiểm tra nếu product không tồn tại
        return null;
    }

    const handleAddToCart = (e) => {
        e.preventDefault(); // Ngăn Link to={`/product/${...}`} bị trigger nếu nút nằm trong Link
        e.stopPropagation(); // Ngăn sự kiện nổi bọt

        try {
            const itemToAdd = {
                id: product.id || product._id, // API 4.1 trả về "id"
                name: product.title || product.name, // API 4.1 có thể có cả "title" và "name"
                price: parseFloat(product.price), // Đảm bảo giá là số
                image: product.image, // API 4.1 có "image"
                quantity: 1, // Mặc định thêm 1 sản phẩm từ shop card
                description: product.description // Thêm description nếu bazarSlice cần
            };
            dispatch(addToCart(itemToAdd));
            toast.success(`${itemToAdd.name} added to cart!`);
        } catch (error) {
            toast.error("Could not add product to cart.");
            console.error("Add to cart error:", error);
        }
    };

    const productPrice = parseFloat(product.price);
    const oldPrice = product.oldPrice ? parseFloat(product.oldPrice) : null;
    const discountPercentage = oldPrice && productPrice < oldPrice 
        ? Math.round(((oldPrice - productPrice) / oldPrice) * 100) 
        : null;

    return (
        <div className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm group hover:shadow-xl">
            <Link to={`/product/${product.id || product._id}`} className="block">
                <div className="relative overflow-hidden aspect-w-1 aspect-h-1"> {/* Giữ tỷ lệ ảnh */}
                    <img
                        src={product.image || 'https://via.placeholder.com/300'} // Ảnh placeholder nếu không có
                        alt={product.title || product.name || "Product Image"}
                        className="object-cover w-full h-full p-2 duration-300 group-hover:scale-105" // Thêm padding P-2
                    />
                </div>
                {/* Discount Badge */}
                {discountPercentage && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase bg-red-500 rounded-full">
                            -{discountPercentage}%
                        </span>
                    </div>
                )}
                 {/* New Badge */}
                {product.isNew && !discountPercentage && ( // Chỉ hiện "New" nếu không có discount
                     <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase bg-green-500 rounded-full">
                            New
                        </span>
                    </div>
                )}
            </Link>

            <div className="flex flex-col flex-grow p-4"> {/* flex-grow để đẩy nút xuống dưới */}
                <Link to={`/product/${product.id || product._id}`} className="block mb-2">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600">
                        {product.title || product.name}
                    </h3>
                </Link>
                {/* Hiển thị category nếu có */}
                {product.category?.name && (
                    <p className="mb-2 text-xs text-gray-500">{product.category.name}</p>
                )}

                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-orange-600">
                        ${productPrice.toFixed(2)}
                    </span>
                    {oldPrice && productPrice < oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ${oldPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Đẩy nút Add to Cart xuống cuối card */}
                <div className="mt-auto">
                     <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        <BsCartPlus className="w-5 h-5 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCard;