import React, { useState, useEffect } from "react";
import { Googlelogo, githublogo } from "../assets";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/bazarSlice";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiService";

export const Login = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check for existing token and user data on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authApi.getProfile();
                    dispatch(addUser(userData));
                    setIsLoggedIn(true);
                    if (userData.role === 'admin') {
                        navigate('/management');
                    } else {
                        navigate(-1);
                    }
                } catch (error) {
                    console.error('Error checking auth:', error);
                    localStorage.removeItem('token');
                    dispatch(removeUser());
                }
            }
        };
        checkAuth();
    }, [dispatch, navigate]);

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                dispatch(
                    addUser({
                        _id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        image: user.photoURL,
                    })
                );
                setIsLoggedIn(true);
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                toast.success("Log Out Successfully!");
                dispatch(removeUser());
                setIsLoggedIn(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await authApi.login({ email, password });
            toast.success("Login Successful!");
            dispatch(
                addUser({
                    _id: data.id,
                    name: data.name,
                    email: data.email,
                    image: data.image,
                    role: data.role
                })
            );
            setIsLoggedIn(true);

            // Redirect based on role
            if (data.role === 'admin') {
                navigate('/management');
            } else {
                navigate(-1);
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(error.response?.data?.message || "Login Failed!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full gap-10 py-20">
            {!isLoggedIn && (
                <>
                    {/* Email/Password Login Form */}
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center w-full max-w-sm gap-4"
                    >
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
                        <button
                            type="submit"
                            className="px-8 py-3 text-base tracking-wide text-white duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </form>

                    {/* Google Login Section */}
                    <div
                        onClick={handleGoogleLogin}
                        className="text-base w-60 h-12 tracking-wide border-[1px] border-gray-400
                        rounded-md flex items-center justify-center gap-2 hover:border-blue-600 cursor-pointer duration-300 p-1"
                    >
                        <img className="w-6 h-6" src={Googlelogo} alt="googlelogo" />
                        <span className="flex items-center justify-center text-gray-900 text-md">
                            Sign in with Google
                        </span>
                    </div>
                </>
            )}

            {/* Sign Out Button */}
            {isLoggedIn && (
                <button
                    onClick={handleSignOut}
                    className="px-8 py-3 text-base tracking-wide text-white duration-300 bg-black rounded-md hover:bg-gray-800"
                >
                    Sign Out
                </button>
            )}

            <ToastContainer
                position="top-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};
