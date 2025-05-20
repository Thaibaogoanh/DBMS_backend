import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/apiService'; // recommendationsApi không còn cần ở đây nữa
import { useSelector } from 'react-redux'; // Vẫn giữ để biết userInfo, có thể dùng cho các logic khác sau này
import SimilarProducts from '../components/SimilarProducts';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import Product from '../components/Product';
import LoadingSpinner from '../components/LoadingSpinner'; // Import spinner
import { toast } from 'react-toastify'; // Giữ lại toast cho các thông báo không phải từ apiService (nếu có)

const ProductDetail = () => {
    const { id: productId } = useParams(); // Đổi tên 'id' thành 'productId' cho rõ ràng
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const userInfo = useSelector((state) => state.bazar.userInfo); // Vẫn giữ nếu có logic khác cần userInfo

    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setError("Product ID is missing.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // productApi.getProduct(id) trả về product object trực tiếp (sau handleResponse)
            // hoặc null/undefined nếu API trả về 200 OK nhưng không có data (ít khả năng)
            // hoặc throw error nếu API lỗi (đã được interceptor xử lý toast)
            const fetchedProduct = await productApi.getProduct(productId);

            if (fetchedProduct && (fetchedProduct.id || fetchedProduct._id)) { // Kiểm tra có phải là một product object hợp lệ
                setProduct(fetchedProduct);
            } else {
                // Trường hợp API trả về 200 nhưng không có product (ví dụ: null, hoặc object rỗng)
                setError('Product not found or failed to load product details.');
                // Không cần toast ở đây nếu apiService đã xử lý lỗi API 404
            }
        } catch (err) {
            // Lỗi từ API call đã được interceptor trong apiService.js toast
            // setError để hiển thị thông báo lỗi trong UI của trang này
            setError(err.message || 'An unexpected error occurred while fetching the product.');
            console.error("Error fetching product details:", err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]); // Sử dụng fetchProduct đã được bọc bởi useCallback

    // Loại bỏ hàm handleAddToCart ở đây, vì Product.js đã có logic riêng.
    // Nếu bạn muốn `recordPurchase` khi thêm vào giỏ, logic đó nên được thêm vào
    // hàm xử lý "Add to Cart" bên trong component `Product.js`.
    // Lý tưởng nhất, `recordPurchase` nên được gọi sau khi đơn hàng được tạo thành công trong Cart.js.

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <LoadingSpinner text="Loading product details..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container px-4 py-12 mx-auto text-center">
                <h2 className="mb-4 text-2xl font-semibold text-red-600">Oops! Product Error.</h2>
                <p className="mb-6 text-lg text-gray-700">{error}</p>
                <button
                    onClick={fetchProduct} // Cho phép người dùng thử lại
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container px-4 py-12 mx-auto text-center">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Product Not Found</h2>
                <p className="mb-6 text-lg text-gray-600">Sorry, we couldn't find the product you're looking for.</p>
                <Link to="/shop" className="px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            {/* Component Product sẽ hiển thị thông tin chi tiết và nút "Add to cart" */}
            <Product product={product} />

            {/* Các phần gợi ý sản phẩm */}
            <div className="mt-12 md:mt-16"> {/* Thêm khoảng cách trên */}
                <SimilarProducts productId={productId} />
            </div>

            <div className="mt-12 md:mt-16"> {/* Thêm khoảng cách trên */}
                <FrequentlyBoughtTogether productId={productId} />
            </div>
        </div>
    );
};

export default ProductDetail;