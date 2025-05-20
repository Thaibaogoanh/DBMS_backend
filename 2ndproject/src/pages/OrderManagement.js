import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import { orderApi } from "../api/apiService"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner"; // Đảm bảo đường dẫn đúng
import { FaEye } from "react-icons/fa"; // Icon cho nút View Details

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Thêm state cho pagination hoặc filter nếu cần sau này
  // const [currentPage, setCurrentPage] = useState(1);
  // const [filters, setFilters] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // orderApi.getAllOrders() sẽ trả về response.data từ handleResponse.
      // Theo API docs (5.4), đây là một mảng các đơn hàng.
      const fetchedOrders = await orderApi.getAllOrders(/* { page: currentPage, ...filters } */);

      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
      } else {
        // Trường hợp này ít xảy ra nếu API luôn trả về mảng hoặc lỗi (đã được interceptor xử lý)
        console.warn("Unexpected response from getAllOrders:", fetchedOrders);
        setOrders([]);
        setError('Failed to fetch orders or data format is incorrect.');
      }
    } catch (err) {
      // Lỗi đã được toast bởi interceptor trong apiService.js
      setError(err.message || 'Failed to fetch orders.');
      console.error("Error fetching orders:", err);
      setOrders([]); // Đặt orders thành mảng rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [/* currentPage, JSON.stringify(filters) */]); // Fetch lại khi page hoặc filter thay đổi

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // orderApi.updateOrderStatus trả về đối tượng đơn hàng đã cập nhật (theo API 5.6)
      const updatedOrder = await orderApi.updateOrderStatus(orderId, { status: newStatus });
      if (updatedOrder && updatedOrder.id) { // Kiểm tra xem có phải là đối tượng order hợp lệ không
        toast.success('Order status updated successfully');
        // Cập nhật lại list tối ưu hơn là fetch lại toàn bộ:
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
        // Hoặc fetchOrders(); // Nếu muốn fetch lại toàn bộ
      } else {
        // Trường hợp này ít xảy ra nếu API trả về đúng hoặc lỗi
        toast.error(updatedOrder?.message || 'Failed to update order status.');
      }
    } catch (err) {
      // Lỗi đã được toast bởi interceptor
      console.error("Error updating order status:", err);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      // orderApi.markOrderAsDelivered trả về đối tượng đơn hàng đã cập nhật (theo API 5.5)
      const updatedOrder = await orderApi.markOrderAsDelivered(orderId);
      if (updatedOrder && updatedOrder.id) {
        toast.success('Order marked as delivered');
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
        // Hoặc fetchOrders();
      } else {
        toast.error(updatedOrder?.message || 'Failed to mark order as delivered.');
      }
    } catch (err) {
      console.error("Error marking order as delivered:", err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner text="Loading orders..." size="large" />
    </div>
  );

  if (error) return (
    <div className="container px-4 py-8 mx-auto text-center">
      <p className="text-xl text-red-500">{error}</p>
      <button onClick={fetchOrders} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
        Retry
      </button>
    </div>
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        {/* Có thể thêm nút "Add Order" nếu admin có quyền này */}
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order ID</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`p-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusBadgeColor(order.status)} border-transparent`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-center whitespace-nowrap">
                    <Link
                      to={`/orders/${order.id}`} // Dẫn đến trang chi tiết đơn hàng
                      title="View Details"
                      className="inline-flex items-center p-2 text-sm font-medium text-blue-600 transition duration-150 ease-in-out bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaEye className="w-4 h-4" />
                    </Link>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleMarkAsDelivered(order.id)}
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        title="Mark as Delivered"
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Thêm pagination controls nếu cần */}
    </div>
  );
};

export default OrderManagement;