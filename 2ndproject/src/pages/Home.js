import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";

import Products from "../components/Products";
import { productApi } from "../api/apiService";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.bazar.userInfo);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts();
        if (Array.isArray(response)) {
          // API returns array directly
          const formattedProducts = response.map(product => ({
            id: product._id || product.id,
            name: product.name || product.title,
            price: product.price,
            image: product.image,
            description: product.description || product.desc
          }));
          setProducts(formattedProducts);
          setError(null);
        } else if (response.success) {
          // API returns { success, data }
          const formattedProducts = response.data.map(product => ({
            id: product._id || product.id,
            name: product.name || product.title,
            price: product.price,
            image: product.image,
            description: product.description || product.desc
          }));
          setProducts(formattedProducts);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch products');
          toast.error(response.message || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        toast.error('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <Banner />
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Our Store</h1>
          <p className="text-xl text-gray-600">
            Discover our latest collection of high-quality products
          </p>
        </div>

        {/* Personalized Recommendations for logged-in users */}
        {userInfo && <PersonalizedRecommendations />}

        {/* Featured Products Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
          {products.length > 0 ? (
            <Products products={products} />
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>

        {/* Special Offers Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Special Offers</h2>
          {/* Add your special offers component here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
