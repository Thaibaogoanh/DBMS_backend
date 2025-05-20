import React, { useState } from "react";
import { BsArrowRight, BsHeart, BsHeartFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/bazarSlice";
import { ToastContainer, toast } from "react-toastify";

const ProductsCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isWishlist, setIsWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const _id = product.title;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);

  const handleDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: product,
      },
    });
  };

  const handleAddToCart = () => {
    try {
      const cartItem = {
        id: product._id || product.id,
        name: product.name || product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      };

      dispatch(addToCart(cartItem));
      toast.success('Product added to cart successfully');
    } catch (err) {
      toast.error('Failed to add product to cart');
      console.error(err);
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlist(!isWishlist);
    toast.success(
      isWishlist
        ? `${product.title} removed from wishlist`
        : `${product.title} added to wishlist`
    );
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div
        onClick={handleDetails}
        className="w-full h-96 cursor-pointer overflow-hidden rounded-t-lg"
      >
        <img
          className="w-full h-full object-cover group-hover:scale-110 duration-500"
          src={product.image}
          alt={product.name || product.title}
        />
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          {isWishlist ? (
            <BsHeartFill className="text-red-500 text-xl" />
          ) : (
            <BsHeart className="text-gray-500 text-xl" />
          )}
        </button>
        {/* Sale Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4">
            <p className="bg-black text-white font-semibold font-titleFont px-6 py-1 rounded-full">
              Sale
            </p>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-titleFont text-lg font-bold text-gray-800">
            <Link to={`/product/${product._id || product.id}`}>
              {product.name || product.title}
            </Link>
          </h2>
          <div className="flex items-center gap-2">
            {product.oldPrice && (
              <p className="text-sm text-gray-500 line-through">
                ${product.oldPrice}
              </p>
            )}
            <p className="text-lg font-bold text-orange-500">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{product.category}</p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${isHovered
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
        >
          Add to Cart
          <BsArrowRight
            className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""
              }`}
          />
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProductsCard;
