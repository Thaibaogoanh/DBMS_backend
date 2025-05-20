// src/pages/Register.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/apiService'; // Đảm bảo đường dẫn đúng
import { addUser } from '../redux/bazarSlice'; // Đảm bảo đường dẫn đúng

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = { name, email, password, phone, address };
            const response = await authApi.register(userData); //

            if (response.user && response.token) {
                dispatch(addUser({
                    _id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    role: response.user.role,
                    // Thêm các trường khác nếu API trả về
                }));
                // localStorage đã được xử lý trong authApi.register
                toast.success('Registration successful! Redirecting...');
                setTimeout(() => {
                    if (response.user.role === 'admin') {
                        navigate('/management');
                    } else {
                        navigate('/');
                    }
                }, 1500);
            } else {
                // Trường hợp API trả về cấu trúc không mong đợi nhưng success = true
                toast.error(response.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            // Lỗi đã được toast.error xử lý trong apiService.js interceptor
            // Chỉ cần log lỗi nếu cần thiết cho debug
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full gap-10 py-20">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm gap-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-[1px] border-gray-400 rounded-md p-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-[1px] border-gray-400 rounded-md p-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-[1px] border-gray-400 rounded-md p-2"
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-[1px] border-gray-400 rounded-md p-2"
                />
                <input
                    type="text"
                    placeholder="Address (Optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border-[1px] border-gray-400 rounded-md p-2"
                />
                <button
                    type="submit"
                    className="px-8 py-3 text-base tracking-wide text-white duration-300 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;