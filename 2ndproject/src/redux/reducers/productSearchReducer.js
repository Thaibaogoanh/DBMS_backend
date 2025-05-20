import {
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAIL,
} from "../constants/productConstants";

export const productSearchReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case SEARCH_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload,
      };
    case SEARCH_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
