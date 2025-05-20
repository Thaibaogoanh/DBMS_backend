// src/components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { Logo3, usericon } from "../assets"; // Giả sử usericon là ảnh placeholder
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingCart, FiSettings, FiGrid, FiStar } from "react-icons/fi"; // Thêm icons nếu cần
import { authApi } from "../api/apiService"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import { removeUser } from "../redux/bazarSlice"; // Import removeUser

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((store) => store.bazar.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null); // Ref cho profile dropdown

  const isAdmin = userInfo?.role === 'admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false); // Đóng profile dropdown khi mở/đóng menu mobile
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = async () => {
    try {
      await authApi.logout(); // Gọi API logout từ service
      dispatch(removeUser()); // Xóa user khỏi Redux store
      toast.success('Logged out successfully');
      setIsProfileOpen(false); // Đóng dropdown
      navigate('/'); // Điều hướng về trang chủ
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(error.response?.data?.message || "Logout failed. Please try again.");
       // Dự phòng: Vẫn xóa local state và token nếu API call thất bại nhưng người dùng muốn logout
      dispatch(removeUser());
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
    }
  };

  const handleCartClick = () => {
    if (!userInfo) {
      toast.info('Please login to view your cart');
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  // Định nghĩa các mục menu cho dễ quản lý
  const baseNavLinks = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  const userRoutes = userInfo && !isAdmin ? [
    { path: "/myorders", label: "My Orders" }, // Thêm link Lịch sử đơn hàng
  ] : [];

  const adminRoutes = userInfo && isAdmin ? [
    { path: "/management", label: "Products", icon: <FiGrid className="inline mr-1 mb-0.5" /> }, // Quản lý sản phẩm (WarehouseManagement)
    { path: "/categories", label: "Categories", icon: <FiGrid className="inline mr-1 mb-0.5" /> },
    { path: "/admin/orders", label: "Orders", icon: <FiShoppingCart className="inline mr-1 mb-0.5" /> }, // Link tới OrderManagement (đổi path nếu cần)
    { path: "/admin/users", label: "Users", icon: <FiUser className="inline mr-1 mb-0.5" /> }, // Link tới trang quản lý người dùng
  ] : [];

  const allNavLinks = [...baseNavLinks, ...userRoutes, ...adminRoutes];

  const renderNavLinks = (isMobile = false) => (
    allNavLinks.map(link => (
      <li key={link.path} className={isMobile ? "py-2" : ""}>
        <Link
          to={link.path}
          onClick={() => isMobile && toggleMenu()} // Đóng menu mobile khi click link
          className="text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300"
        >
          {link.icon}{link.label}
        </Link>
      </li>
    ))
  );


  return (
    <div className="w-full bg-white border-b-[1px] border-b-gray-800 font-titleFont sticky top-0 z-50">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <div>
              <img className="w-20 md:w-28" src={Logo3} alt="logoDark" /> {/* Tăng kích thước logo trên desktop */}
            </div>
          </Link>

          {/* Search Bar - Luôn hiển thị trên desktop, chiếm không gian */}
          <div className="flex-grow hidden mx-4 md:flex md:justify-center"> {/* flex-grow để chiếm không gian còn lại, justify-center để căn giữa search bar */}
            <div className="w-full max-w-xl"> {/* Giới hạn chiều rộng của search bar */}
                <SearchBar />
            </div>
          </div>


          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-6 md:flex"> {/* Tăng gap */}
            <ul className="flex items-center gap-6"> {/* Tăng gap */}
              {renderNavLinks()}
            </ul>

            {/* Cart - Chỉ hiển thị cho role 'user' */}
            {userInfo && !isAdmin && (
              <button onClick={handleCartClick} className="relative group">
                <FiShoppingCart className="transition-transform w-7 h-7 group-hover:scale-110" /> {/* Tăng kích thước icon */}
                {productData.length > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-orange-500 rounded-full -top-2 -right-2 group-hover:animate-ping-once"> {/* Thay đổi animation */}
                    {productData.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth Buttons / User Profile */}
            {userInfo ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100" // Thêm padding và hover effect
                >
                  <img
                    className="w-10 h-10 rounded-full" // Kích thước nhất quán
                    src={userInfo.image || usericon}
                    alt="user avatar"
                  />
                  {/* Tên người dùng có thể ẩn trên mobile hoặc màn hình nhỏ hơn nếu cần thêm không gian */}
                  <span className="hidden text-sm font-medium lg:block">
                    {userInfo.name}
                    {isAdmin && <span className="ml-1 text-xs text-blue-600">(Admin)</span>}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl"> {/* Tăng shadow */}
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold">{userInfo.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-orange-700"
                    >
                      <FiUser className="inline w-4 h-4 mr-2" /> Profile
                    </Link>
                    {/* Các link bổ sung cho admin trong dropdown (nếu cần) */}
                    {isAdmin && (
                         <Link
                            to="/management" // Hoặc một trang dashboard admin tổng quan
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-orange-700"
                            >
                            <FiSettings className="inline w-4 h-4 mr-2" /> Admin Panel
                        </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100" // Để màu đỏ cho logout
                    >
                      <FiLogOut className="inline w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden px-4 py-2 text-sm font-medium text-orange-500 border border-orange-500 rounded-md sm:block hover:bg-orange-50" // Ẩn trên màn hình rất nhỏ
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {/* Cart icon cho user trên mobile, trước nút menu */}
            {userInfo && !isAdmin && (
              <button onClick={handleCartClick} className="relative p-2 mr-2 group">
                <FiShoppingCart className="w-6 h-6" />
                {productData.length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-orange-500 rounded-full">
                    {productData.length}
                  </span>
                )}
              </button>
            )}
            <button className="p-2 text-2xl" onClick={toggleMenu}>
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Search Bar for Mobile - Hiển thị bên dưới logo khi menu chưa mở, hoặc trong menu khi đã mở */}
        <div className={`pt-2 pb-4 md:hidden ${isMenuOpen ? 'hidden' : 'block'}`}>
            <SearchBar />
        </div>


        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="py-4 border-t md:hidden">
             {/* Search Bar trong Mobile Menu */}
            <div className="px-2 mb-4">
                <SearchBar />
            </div>
            <ul className="px-2 space-y-2">
              {renderNavLinks(true)}

              <hr className="my-3"/>

              {userInfo ? (
                <>
                  {/* Không cần link Cart ở đây nữa vì đã có icon ở trên */}
                  <li>
                    <Link
                      to="/profile"
                      onClick={toggleMenu}
                      className="flex items-center py-2 text-base font-bold text-black hover:text-orange-900"
                    >
                      <FiUser className="inline w-5 h-5 mr-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => { handleLogout(); toggleMenu(); }}
                      className="flex items-center w-full py-2 text-base font-bold text-left text-red-600 hover:text-red-700"
                    >
                      <FiLogOut className="inline w-5 h-5 mr-2" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="block py-2 text-base font-bold text-black hover:text-orange-900"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={toggleMenu}
                      className="block py-2 text-base font-bold text-black hover:text-orange-900"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;