import React from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import { Login } from "./pages/Login";
import { productsData } from "./api/Api";
import OrderManagement from "./pages/OrderManagement";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";
import MyOrders from "./pages/MyOrders";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminUserManagement from "./pages/AdminUserManagement";
import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    ScrollRestoration,
    Navigate
} from "react-router-dom";
import { Contact } from "./pages/Contact";
import { WarehouseManagement } from "./pages/WarehouseManagement";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser } from "./redux/bazarSlice";
import { authApi } from './api/apiService'; // Đảm bảo đường dẫn
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Provider } from 'react-redux';
import CategoryManagement from "./pages/CategoryManagement";
import LoadingSpinner from "./components/LoadingSpinner"; // Hoặc một component loading đơn giản

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const userInfo = useSelector((store) => store.bazar.userInfo);

    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && userInfo.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

const Layout = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.bazar.userInfo);
    useEffect(() => {
        const checkAuthOnLoad = async () => {
            const token = localStorage.getItem('token');
            if (token && !userInfo) { // Nếu có token nhưng userInfo trong Redux chưa có
                try {
                    console.log("Layout: Token found, userInfo not in Redux. Fetching profile...");
                    const userDataFromApi = await authApi.getProfile();
                    dispatch(addUser(userDataFromApi)); // Dispatch thông tin người dùng lấy được
                } catch (error) {
                    console.error('Layout: Error fetching profile with existing token:', error);
                    // Nếu token không hợp lệ (ví dụ hết hạn và refresh token cũng lỗi)
                    // apiService đã xử lý việc xóa token và redirect về /login
                    // dispatch(removeUser()); // Đảm bảo Redux cũng được clear
                }
            }
        };

        // Chỉ chạy khi component mount lần đầu, hoặc khi userInfo thay đổi từ có sang không (logout)
        // để tránh gọi lại không cần thiết nếu PersistGate đã làm việc.
        // Hoặc bạn có thể để dependency array rỗng [] nếu chỉ muốn check 1 lần lúc tải.
        if (!userInfo) {
            checkAuthOnLoad();
        }

    }, [dispatch, userInfo]);

    return (
        <div>
            <Header />
            <ScrollRestoration />
            <Outlet />
            <Footer />
        </div>
    );
};

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                    loader: productsData,
                },
                {
                    path: "/product/:id",
                    element: <ProductDetail />,
                },
                {
                    path: "/cart",
                    element: (
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/shop",
                    element: <Shop />,
                    loader: productsData,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/management",
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <WarehouseManagement />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/categories",
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <CategoryManagement />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/contact",
                    element: <Contact />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
                {
                    path: "/profile",
                    element: (
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/myorders", // Hoặc "/orders/myorders" cho nhất quán với API path
                    element: (
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/orders/:id", // Người dùng thường và Admin đều có thể xem
                    element: (
                        <ProtectedRoute>
                            <OrderDetailPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/admin/users", // Đường dẫn ví dụ
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <AdminUserManagement />
                        </ProtectedRoute>
                    ),
                },  
                {
                    path: "/admin/orders", // Đường dẫn ví dụ
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <OrderManagement />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ]);


    // Component loading đơn giản
    const AppLoading = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoadingSpinner text="Initializing application..." size="large" />
        </div>
    );


    return (
        <Provider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
                <div className="font-bodyFont">
                    <RouterProvider router={router} />
                </div>
            </PersistGate>
        </Provider>
    );
};

export default App;
