import {
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAIL,
} from "../constants/productConstants";
import axios from "axios";

export const searchProducts = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    console.log("Searching for:", keyword);

    // Sử dụng API endpoint theo API docs (GET /products/?search=keyword)
    const { data } = await axios.get(
      `http://localhost:5000/api/products?search=${encodeURIComponent(keyword)}` // SỬA Ở ĐÂY
    );
    // Giả sử API này trả về một mảng sản phẩm trực tiếp, hoặc đối tượng {data: [...]}
    // Nếu nó trả về {success: true, data: [...]} thì `data.data` mới là mảng sản phẩm
    // Cần điều chỉnh payload cho SEARCH_PRODUCTS_SUCCESS cho phù hợp với response thực tế

    let productsArray = [];
    if (Array.isArray(data)) {
      productsArray = data;
    } else if (data && data.data && Array.isArray(data.data)) { // Nếu API trả về { data: [...] }
      productsArray = data.data;
    } else if (data && data.success && Array.isArray(data.data)) { // Nếu API trả về { success: true, data: [...] }
      productsArray = data.data;
    }

    console.log("Search results from API:", productsArray);

    dispatch({
      type: SEARCH_PRODUCTS_SUCCESS,
      payload: productsArray, // Gửi mảng sản phẩm
    });
  } catch (error) {
    console.error("Search error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Search failed";
    dispatch({
      type: SEARCH_PRODUCTS_FAIL,
      payload: errorMessage,
    });
    // toast.error(errorMessage); // Cân nhắc có nên toast ở đây không vì apiService đã có interceptor
  }
};