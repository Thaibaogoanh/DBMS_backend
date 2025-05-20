import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/apiService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SimilarProducts = ({ productId }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                setLoading(true);
                const response = await recommendationsApi.getSimilarProducts(productId);
                if (response.success) {
                    setSimilarProducts(response.data);
                    setError(null);
                } else {
                    setError(response.message || 'Failed to load similar products');
                    toast.error(response.message || 'Failed to load similar products');
                }
            } catch (err) {
                setError('Failed to load similar products');
                toast.error('Failed to load similar products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [productId]);

    if (loading) return <div className="py-6 text-center">Loading similar products...</div>;
    if (error) return <div className="py-6 text-center text-red-500">{error}</div>;
    if (!similarProducts.length) return null;

    return (
        <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">Similar Products</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {similarProducts
                    .filter(product => product && product.productId)
                    .map((product) => (
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
                                {product.similarityScore && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Similarity: {Math.round(product.similarityScore * 100)}%
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default SimilarProducts; 