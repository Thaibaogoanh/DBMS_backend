// src/pages/MyOrders.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/apiService'; // Đảm bảo đường dẫn đúng
import LoadingSpinner from '../components/LoadingSpinner'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await orderApi.getMyOrders(); // API 5.2
                // Giả sử response là một mảng các đơn hàng theo API docs 5.2
                // Hoặc nếu response có dạng { success: true, data: [...] } thì lấy response.data
                if (Array.isArray(response)) {
                    setOrders(response);
                } else if (response && response.data && Array.isArray(response.data)) {
                    setOrders(response.data)
                } else if (response && response.success && Array.isArray(response.data)) {
                     setOrders(response.data);
                }
                else {
                    setOrders(response || []); // Nếu API trả về mảng trực tiếp
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch orders.');
                // toast.error đã được gọi trong apiService interceptor
                console.error("Error fetching my orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="py-10 text-center"><LoadingSpinner text="Loading your orders..." /></div>;
    if (error) return <div className="py-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
            {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="p-6 bg-white rounded-lg shadow-md">
                            <div className="flex flex-wrap items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                                    <p className="text-sm text-gray-600">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                                    'bg-blue-200 text-blue-800'
                                }`}>
                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                </span>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-medium">Total Amount: ${parseFloat(order.totalAmount).toFixed(2)}</h3>
                                {/* Bạn có thể muốn hiển thị một vài item đầu tiên nếu API 5.2 trả về items */}
                                {order.items && order.items.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        {order.items.length} item(s)
                                    </p>
                                )}
                            </div>
                            <Link
                                to={`/orders/${order.id}`}
                                className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;