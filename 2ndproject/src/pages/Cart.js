// src/pages/Cart.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Đảm bảo useDispatch đã được import nếu bạn resetCart
import CartItem from "../components/CartItem";
// import blue from "../blue.png";
import { ToastContainer, toast } from "react-toastify";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <--- THÊM DÒNG NÀY
import { orderApi, recommendationsApi } from '../api/apiService'; // <--- THÊM DÒNG NÀY, đảm bảo đường dẫn đúng
import { resetCart } from "../redux/bazarSlice";

const Cart = () => {
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((state) => state.bazar.userInfo);
  const [totalAmt, setTotalAmt] = useState("");
  const [payNow, setPayNow] = useState(false);

  const navigate = useNavigate(); // <--- KHAI BÁO navigate ở đây
  const dispatch = useDispatch(); // Khai báo dispatch
  const [shippingDetails, setShippingDetails] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: userInfo?.phone || '', // Lấy SĐT từ userInfo nếu có
  });
  const [showShippingForm, setShowShippingForm] = useState(false); // Để ẩn/hiện form địa chỉ

  useEffect(() => {
    let price = 0;
    productData.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price.toFixed(2));
  }, [productData]);

  const handleShippingChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateShippingDetails = () => {
    // Thêm logic kiểm tra các trường bắt buộc của địa chỉ
    if (!shippingDetails.street || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country || !shippingDetails.phone) {
      toast.error("Please fill in all shipping details.");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!userInfo) {
      toast.error("Please sign in to Checkout");
      navigate('/login');
      return;
    }
    if (!validateShippingDetails()) { // Kiểm tra địa chỉ trước khi thanh toán
      return;
    }
    setPayNow(true); // Hiển thị nút StripeCheckout
  };


  const handleCheckout = () => { // Đổi tên hàm này để tránh nhầm lẫn
    if (!userInfo) {
      toast.error("Please sign in to Checkout");
      navigate('/login');
      return;
    }
    setShowShippingForm(true); // Hiển thị form địa chỉ thay vì đi thẳng tới thanh toán
  };


  const payment = async (stripeToken) => {
    if (!validateShippingDetails()) return; // Kiểm tra lại địa chỉ lần nữa

    try {
      const orderData = {
        items: productData.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: { // Sử dụng state shippingDetails
          street: shippingDetails.street,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
          phone: shippingDetails.phone,
        },
        paymentMethod: "CreditCard", // Hoặc "Stripe"
      };

      const response = await orderApi.createOrder(orderData);
      toast.success(response.message || 'Order placed successfully!');
      dispatch(resetCart());

      for (const item of productData) {
        try {
          await recommendationsApi.recordPurchase(item._id);
        } catch (recError) {
          console.error(`Failed to record purchase for ${item._id}`, recError);
        }
      }

      setTimeout(() => {
        if (response.id) {
          navigate(`/orders/${response.id}`);
        } else if (response.order && response.order.id) {
          navigate(`/orders/${response.order.id}`);
        } else {
          navigate('/shop');
        }
      }, 1500);

    } catch (error) {
      console.error("Order placement or payment error:", error);
    }
  };

  return (
    <div>
      <img
        className="object-cover w-full h-60"
        src="https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="cartImg"
      />
      <div className="flex flex-col max-w-screen-xl py-20 mx-auto md:flex-row"> {/* Responsive */}
        <CartItem />
        <div className="w-full md:w-1/3 bg-[#fafafa] py-6 px-4 mt-8 md:mt-0"> {/* Responsive */}
          <div className="flex flex-col gap-6 pb-6 border-b-[1px] border-b-gray-400">
            <h2 className="text-2xl font-medium">Cart Totals</h2>
            <p className="flex items-center justify-between gap-4 text-base"> {/* justify-between */}
              Subtotal{" "}
              <span className="text-lg font-bold font-titleFont">
                ${totalAmt}
              </span>
            </p>
            {/* Có thể thêm phí ship ở đây nếu có */}
          </div>
          <p className="flex justify-between mt-6 font-semibold font-titleFont">
            Total <span className="text-xl font-bold">${totalAmt}</span>
          </p>

          {!showShippingForm && (
            <button
              onClick={handleCheckout}
              className="w-full py-3 mt-6 text-base text-white duration-300 bg-black hover:bg-gray-800"
            >
              Proceed to Shipping
            </button>
          )}

          {/* Shipping Details Form */}
          {showShippingForm && !payNow && (
            <div className="mt-6">
              <h3 className="mb-4 text-xl font-semibold">Shipping Details</h3>
              <div className="space-y-3">
                <input type="text" name="street" placeholder="Street Address" value={shippingDetails.street} onChange={handleShippingChange} className="w-full p-2 border rounded" required />
                <input type="text" name="city" placeholder="City" value={shippingDetails.city} onChange={handleShippingChange} className="w-full p-2 border rounded" required />
                <input type="text" name="postalCode" placeholder="Postal Code" value={shippingDetails.postalCode} onChange={handleShippingChange} className="w-full p-2 border rounded" required />
                <input type="text" name="country" placeholder="Country" value={shippingDetails.country} onChange={handleShippingChange} className="w-full p-2 border rounded" required />
                <input type="tel" name="phone" placeholder="Phone Number" value={shippingDetails.phone} onChange={handleShippingChange} className="w-full p-2 border rounded" required />
              </div>
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 mt-6 text-base text-white duration-300 bg-green-600 hover:bg-green-700"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => setShowShippingForm(false)}
                className="w-full py-2 mt-2 text-sm text-gray-700 duration-300 bg-gray-200 hover:bg-gray-300"
              >
                Back to Cart
              </button>
            </div>
          )}

          {/* Stripe Checkout Button */}
          {payNow && userInfo && (
            <div className="flex flex-col items-center justify-center w-full mt-6"> {/* flex-col */}
              <p className="mb-2 text-sm text-gray-600">Review your order and pay with Stripe.</p>
              <StripeCheckout
                // ... (các props khác của StripeCheckout) ...
                stripeKey="YOUR_STRIPE_PUBLIC_KEY" // THAY BẰNG KEY PUBLIC CỦA BẠN
                name="Fast Fashion Online Shopping"
                amount={totalAmt * 100}
                label="Pay to FastFashion"
                description={`Your Payment amount is $${totalAmt}`}
                token={payment}
                email={userInfo.email}
              // Có thể thêm các tùy chọn shippingAddress, billingAddress cho Stripe nếu muốn
              // shippingAddress
              // billingAddress
              />
              <button
                onClick={() => { setPayNow(false); /* setShowShippingForm(true) nếu muốn quay lại form địa chỉ */ }}
                className="w-full py-2 mt-2 text-sm text-blue-600 duration-300 hover:underline"
              >
                Edit Shipping Details or Cart
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
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

export default Cart;