// src/pages/AdminUserManagement.js
import React, { useState, useEffect } from 'react';
import { userApi } from '../api/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
// Cân nhắc tạo một Modal component để chỉnh sửa user
// import UserEditModal from '../components/UserEditModal'; 

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [editingUser, setEditingUser] = useState(null); // Cho modal chỉnh sửa
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userApi.getAllUsers(); // API 2.1
            // API 2.1 trả về mảng users trực tiếp
            setUsers(response || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch users.');
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (userId, userData) => { // userData: { role, isActive }
        try {
            const updatedUserResponse = await userApi.updateUser(userId, userData); // API 2.2
            toast.success(updatedUserResponse.message || 'User updated successfully!');
            fetchUsers(); // Tải lại danh sách users
            // setIsModalOpen(false);
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    // const openEditModal = (user) => {
    //     setEditingUser(user);
    //     setIsModalOpen(true);
    // };

    if (loading) return <div className="py-10 text-center"><LoadingSpinner text="Loading users..." /></div>;
    if (error) return <div className="py-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold">User Management</h1>
            {/* Thêm bộ lọc, tìm kiếm nếu cần */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Active</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                        className="p-1 border rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <select
                                        value={user.isActive ? 'true' : 'false'}
                                        onChange={(e) => handleUpdateUser(user.id, { isActive: e.target.value === 'true' })}
                                        className="p-1 border rounded"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.phone || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* <button 
                                        onClick={() => openEditModal(user)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button> */}
                                    {/* Thêm nút khác nếu cần */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* {isModalOpen && editingUser && (
                <UserEditModal 
                    user={editingUser} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateUser} // Hàm này sẽ nhận (userId, dataToUpdate)
                />
            )} */}
        </div>
    );
};

export default AdminUserManagement;