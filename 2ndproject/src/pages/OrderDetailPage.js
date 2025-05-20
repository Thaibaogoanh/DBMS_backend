// src/pages/OrderDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
    const { id: orderId } = useParams(); // Lấy orderId từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) return;
            try {
                setLoading(true);
                setError(null);
                const response = await orderApi.getOrder(orderId); // API 5.3
                // API 5.3 trả về chi tiết đơn hàng, bao gồm cả user và items.
                setOrder(response);
            } catch (err) {
                setError(err.message || `Failed to fetch order ${orderId}.`);
                console.error("Error fetching order detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [orderId]);

    if (loading) return <div className="py-10 text-center"><LoadingSpinner text={`Loading order ${orderId}...`} /></div>;
    if (error) return <div className="py-10 text-center text-red-500">Error: {error}</div>;
    if (!order) return <div className="py-10 text-center">Order not found.</div>;

    const {
        id,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status,
        paymentStatus,
        createdAt,
        user, // Thông tin người dùng đặt hàng (nếu API trả về)
        items   // Danh sách các sản phẩm trong đơn hàng
    } = order;

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-2 text-3xl font-bold">Order Details</h1>
            <p className="mb-6 text-gray-600">Order ID: {id}</p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Order Summary */}
                <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                    <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                    <div className="mb-4 space-y-2">
                        <p><strong>Date Placed:</strong> {new Date(createdAt).toLocaleString()}</p>
                        <p><strong>Total Amount:</strong> <span className="font-bold text-blue-600">${parseFloat(totalAmount).toFixed(2)}</span></p>
                        <p><strong>Payment Method:</strong> {paymentMethod}</p>
                        <p><strong>Payment Status:</strong> <span className="capitalize">{paymentStatus}</span></p>
                        <p><strong>Order Status:</strong> <span className="font-semibold capitalize">{status}</span></p>
                    </div>

                    <h3 className="mt-6 mb-3 text-lg font-semibold">Items Ordered ({items?.length || 0})</h3>
                    <div className="space-y-4">
                        {items?.map(item => (
                            <div key={item.id || item.productId} className="flex items-start gap-4 p-3 border rounded-md">
                                <img
                                    src={item.product?.image || 'https://via.placeholder.com/80'} // API 5.1 response có product.image
                                    alt={item.product?.name || 'Product Image'}
                                    className="object-cover w-20 h-20 rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.product?.name || 'Product Name'}</h4>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Price per item: ${parseFloat(item.price).toFixed(2)}</p>
                                    <p className="mt-1 font-semibold">Subtotal: ${parseFloat(item.subtotal || (item.quantity * item.price)).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping & User Info */}
                <div className="space-y-6">
                    {shippingAddress && (
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                            <address className="not-italic">
                                {shippingAddress.street}<br />
                                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                                {shippingAddress.country}<br />
                                Phone: {shippingAddress.phone}
                            </address>
                        </div>
                    )}
                    {user && (
                         <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;