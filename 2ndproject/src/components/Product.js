import React, { useState, useEffect, useCallback } from "react"; // Thêm useCallback
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md"; // Thêm MdOutlineStarBorder
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi"; // Icons cho quantity và cart
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/bazarSlice";
import { ToastContainer, toast } from "react-toastify";
import { productApi } from "../api/apiService";
import LoadingSpinner from "./LoadingSpinner"; // Giả sử bạn có component này
import { Link } from 'react-router-dom';

const Product = ({ product: initialProduct }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.bazar.userInfo);

    const [product, setProduct] = useState(initialProduct);
    const [baseQty, setBaseQty] = useState(1);
    const [rating, setRating] = useState(0); // Rating cho review mới
    const [reviewComment, setReviewComment] = useState(""); // Đổi tên từ 'review' để rõ ràng hơn
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Cập nhật product state nếu initialProduct prop thay đổi
    useEffect(() => {
        setProduct(initialProduct);
        // Reset các state liên quan khi sản phẩm thay đổi
        setBaseQty(1);
        setRating(0);
        setReviewComment("");
        // Không cần submittedReviews riêng nữa nếu chúng ta cập nhật trực tiếp product.reviews
    }, [initialProduct]);

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!product || product.stock === undefined) return;

        if (product.stock === 0) {
            toast.error("Sorry, this product is out of stock.");
            return;
        }
        if (baseQty > product.stock) {
            toast.error(`Only ${product.stock} items available in stock.`);
            setBaseQty(product.stock); // Điều chỉnh số lượng về max có thể
            return;
        }
        if (baseQty <= 0) {
            toast.error("Quantity must be at least 1.");
            return;
        }

        dispatch(addToCart({
            id: product.id || product._id,
            title: product.title || product.name,
            image: product.image,
            price: parseFloat(product.price),
            quantity: baseQty,
            description: product.description,
        }));
        toast.success(`${product.title || product.name} (x${baseQty}) added to cart!`);
        // Không trừ stock ở client. Backend sẽ xử lý sau khi order.
    };

    // Xử lý gửi đánh giá
    const handleReviewSubmit = async () => {
        if (!userInfo) {
            toast.error("Please login to submit a review.");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        if (!reviewComment.trim()) {
            toast.error("Please write your review comment.");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const reviewData = {
                rating: rating,
                comment: reviewComment.trim()
            };
            // API 4.6 trả về đối tượng review vừa tạo
            const newReview = await productApi.createReview(product.id || product._id, reviewData);

            if (newReview && (newReview.id || newReview._id)) {
                // Cập nhật state product với review mới và thông tin liên quan
                setProduct(prevProduct => {
                    const updatedReviews = [newReview, ...(prevProduct.reviews || [])];
                    // Tính toán lại averageRating và numReviews (client-side approximation)
                    // Tốt nhất là API createReview trả về product đã được cập nhật,
                    // hoặc fetch lại product sau khi review.
                    // Dưới đây là cách tính tạm thời nếu API chỉ trả về newReview:
                    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
                    const newAverageRating = updatedReviews.length > 0 ? (totalRating / updatedReviews.length).toFixed(1) : 0;
                    const newNumReviews = updatedReviews.length;

                    return {
                        ...prevProduct,
                        reviews: updatedReviews,
                        averageRating: newAverageRating, // Cập nhật nếu có
                        numReviews: newNumReviews // Cập nhật nếu có
                    };
                });
                setRating(0);
                setReviewComment("");
                toast.success(newReview.message || "Review submitted successfully!");
            } else {
                 toast.error(newReview.message || "Failed to submit review. Invalid response from server.");
            }
        } catch (error) {
            // Lỗi đã được toast bởi apiService interceptor
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Hàm render sao
    const renderStars = (ratingValue, interactive = false, onStarClick = () => {}) => {
        const stars = [];
        const numRating = parseFloat(ratingValue) || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                interactive ? (
                    <MdOutlineStar
                        key={i}
                        className={`cursor-pointer text-2xl transition-colors ${i <= numRating ? "text-yellow-500 hover:text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}
                        onClick={() => onStarClick(i)}
                    />
                ) : (
                    <MdOutlineStar
                        key={i}
                        className={`text-xl ${i <= numRating ? "text-yellow-500" : "text-gray-300"}`}
                    />
                )
            );
        }
        return <div className="flex">{stars}</div>;
    };

    if (!product) return null; // Hoặc một fallback UI nếu initialProduct có thể là null/undefined

    const productPrice = parseFloat(product.price).toFixed(2);
    const oldProductPrice = product.oldPrice ? parseFloat(product.oldPrice).toFixed(2) : null;
    const isOutOfStock = product.stock === 0;

    return (
        <div className="py-8">
            <div className="flex flex-col max-w-6xl gap-8 p-4 mx-auto lg:flex-row lg:gap-12">
                {/* Product Image Section */}
                <div className="relative w-full lg:w-2/5">
                    <div className="overflow-hidden rounded-lg shadow-lg aspect-square"> {/* Giữ tỷ lệ vuông */}
                        <img
                            className="object-cover w-full h-full"
                            src={product.image || 'https://via.placeholder.com/600?text=No+Image'}
                            alt={product.title || product.name}
                        />
                    </div>
                    {product.isNew && (
                        <div className="absolute px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-green-500 rounded-full top-4 left-4">
                            New
                        </div>
                    )}
                    {isOutOfStock && (
                        <div className="absolute px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-red-500 rounded-full top-4 right-4">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Product Details Section */}
                <div className="flex flex-col justify-start w-full lg:w-3/5">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                        {product.title || product.name}
                    </h1>

                    {/* Rating and Reviews Link */}
                    <div className="flex items-center gap-3 mt-2 mb-4">
                        {renderStars(product.averageRating)}
                        <a href="#reviews-section" className="text-sm text-blue-600 hover:underline">
                            ({product.numReviews || 0} review{product.numReviews !== 1 ? 's' : ''})
                        </a>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <p className="text-3xl font-bold text-orange-600">${productPrice}</p>
                        {oldProductPrice && (
                            <p className="text-xl text-gray-400 line-through">${oldProductPrice}</p>
                        )}
                    </div>

                    {/* Description */}
                    <p className="mb-6 leading-relaxed text-gray-600">
                        {product.description || "No description available."}
                    </p>

                    {/* Stock and Category */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <span className="font-semibold text-gray-700">Availability: </span>
                            {isOutOfStock ? (
                                <span className="font-bold text-red-600">Out of Stock</span>
                            ) : (
                                <span className="font-bold text-green-600">{product.stock} in Stock</span>
                            )}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Category: </span>
                            <span className="font-medium text-gray-600 capitalize">
                                {product.category?.name || 'N/A'}
                            </span>
                        </div>
                    </div>


                    {/* Quantity and Add to Cart */}
                    {!isOutOfStock && (
                        <div className="flex flex-col items-stretch gap-4 mt-4 sm:flex-row sm:items-center">
                            <div className="flex items-center justify-between p-1 border border-gray-300 rounded-md sm:w-auto">
                                <button
                                    onClick={() => setBaseQty(prevQty => Math.max(1, prevQty - 1))}
                                    disabled={baseQty <= 1}
                                    className="p-2 text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiMinus />
                                </button>
                                <span className="px-5 text-lg font-semibold">{baseQty}</span>
                                <button
                                    onClick={() => setBaseQty(prevQty => Math.min(prevQty + 1, product.stock || 1))} // Ngăn vượt quá stock
                                    disabled={baseQty >= (product.stock || 1)}
                                    className="p-2 text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || baseQty > (product.stock || 0)}
                                className="flex items-center justify-center flex-grow w-full px-8 py-3 text-base font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed sm:w-auto"
                            >
                                <FiShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </button>
                        </div>
                    )}
                     {isOutOfStock && (
                        <p className="p-3 mt-4 font-semibold text-center text-red-700 bg-red-100 rounded-md">
                            This product is currently unavailable.
                        </p>
                    )}
                </div>
            </div>

            {/* Review Section */}
            <div id="reviews-section" className="max-w-4xl pt-10 mx-auto mt-12 border-t border-gray-200">
                {/* Write Review Form */}
                <div className="p-6 mb-10 bg-white rounded-lg shadow-lg">
                    <h3 className="mb-1 text-2xl font-semibold text-gray-800">Write a Customer Review</h3>
                    <p className="mb-5 text-sm text-gray-500">Share your thoughts about this product.</p>
                    {userInfo ? (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">Your Rating <span className="text-red-500">*</span></label>
                                {renderStars(rating, true, (starValue) => setRating(starValue))}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reviewComment" className="block mb-1 text-sm font-medium text-gray-700">Your Review <span className="text-red-500">*</span></label>
                                <textarea
                                    id="reviewComment"
                                    className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    placeholder="What did you like or dislike? What did you use this product for?"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                onClick={handleReviewSubmit}
                                disabled={isSubmittingReview}
                                className="flex items-center justify-center px-6 py-2 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            >
                                {isSubmittingReview ? <LoadingSpinner size="small" text=""/> : "Submit Review"}
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-600">
                            Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to write a review.
                        </p>
                    )}
                </div>

                {/* Display Reviews */}
                <h3 className="mb-6 text-2xl font-semibold text-gray-800">Customer Reviews ({product.reviews?.length || 0})</h3>
                {(product.reviews && product.reviews.length > 0) ? (
                    <div className="space-y-6">
                        {product.reviews.map((rev, index) => (
                            <div key={rev.id || rev._id || `api-rev-${index}`} className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center mb-2">
                                    {/* Giả sử rev.user là object có name và image */}
                                    {rev.user?.image && <img src={rev.user.image} alt={rev.user.name} className="w-10 h-10 mr-3 rounded-full"/>}
                                    <div>
                                        <p className="font-semibold text-gray-800">{rev.user?.name || 'Anonymous'}</p>
                                        <div className="flex items-center">
                                            {renderStars(rev.rating)}
                                        </div>
                                    </div>
                                    {/* API 4.2 có createdAt cho review */}
                                    <p className="ml-auto text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="leading-relaxed text-gray-600">{rev.comment}</p>
                            </div>
                        ))}
                        {/* Không cần hiển thị submittedReviews riêng nữa nếu product.reviews được cập nhật đúng */}
                    </div>
                ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
            </div>
            {/* ToastContainer nên đặt ở App.js hoặc Layout.js để dùng chung */}
            {/* <ToastContainer position="top-left" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" /> */}
        </div>
    );
};

export default Product;