// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { authApi } from '../api/apiService';
import { addUser } // Cập nhật thông tin user trong redux nếu cần
    from '../redux/bazarSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.bazar.userInfo);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        image: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authApi.getProfile(); //
                setProfileData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    image: data.image || ''
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        if (userInfo) {
            fetchProfile();
        }
    }, [userInfo]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            // Chỉ gửi các trường thực sự muốn cập nhật và có giá trị
            const dataToUpdate = {
                name: profileData.name,
                phone: profileData.phone,
                address: profileData.address,
                image: profileData.image,
            };
            const response = await authApi.updateProfile(dataToUpdate); //
            toast.success(response.message || 'Profile updated successfully!');
            // Cập nhật lại Redux store nếu cần
            if (response.user) {
                 dispatch(addUser({ // Giả sử response.user có cấu trúc phù hợp
                    _id: response.user.id,
                    name: response.user.name,
                    email: response.user.email, // Email thường không đổi ở đây
                    role: userInfo.role, // Vai trò không đổi
                    image: response.user.image,
                    // phone, address nếu API trả về
                }));
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoadingPassword(true);
        try {
            const response = await authApi.changePassword(passwordData); //
            toast.success(response.message || 'Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            console.error("Failed to change password", error);
        } finally {
            setLoadingPassword(false);
        }
    };

    if (!userInfo) {
        return <div className="py-10 text-center">Please login to view your profile.</div>;
    }

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

            {/* Update Profile Form */}
            <form onSubmit={handleProfileSubmit} className="p-6 mb-10 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-xl font-semibold">Update Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Name</label>
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input type="email" name="email" value={profileData.email} className="w-full p-2 bg-gray-100 border rounded" readOnly />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Phone</label>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Address</label>
                        <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium">Image URL</label>
                        <input type="text" name="image" value={profileData.image} onChange={handleProfileChange} className="w-full p-2 border rounded" />
                         {profileData.image && <img src={profileData.image} alt="Profile" className="w-20 h-20 mt-2 rounded-full" />}
                    </div>
                </div>
                <button type="submit" disabled={loadingProfile} className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {loadingProfile ? "Saving..." : "Save Profile"}
                </button>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-xl font-semibold">Change Password</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Current Password</label>
                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">New Password</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>
                 <button type="submit" disabled={loadingPassword} className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {loadingPassword ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default Profile;