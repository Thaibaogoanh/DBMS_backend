import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/apiService';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PersonalizedRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userInfo = useSelector((state) => state.bazar.userInfo);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await recommendationsApi.getUserRecommendations();
                if (response.success) {
                    setRecommendations(response.data);
                }
            } catch (err) {
                setError('Failed to load recommendations');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [userInfo]);

    if (loading) return <div className="text-center">Loading recommendations...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!recommendations.length) return null;

    return (
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">Recommended for You</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {recommendations.map((product) => (
                    <Link
                        key={product.productId}
                        to={`/product/${product.productId}`}
                        className="block transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                    >
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                {product.title}
                            </h3>
                            <p className="text-gray-600">${product.price}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Based on your purchase history
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PersonalizedRecommendations; 