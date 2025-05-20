import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/apiService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FrequentlyBoughtTogether = ({ productId }) => {
    const [frequentProducts, setFrequentProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFrequentProducts = async () => {
            try {
                setLoading(true);
                const response = await recommendationsApi.getFrequentlyBought(productId);
                if (response.success) {
                    setFrequentProducts(response.data);
                    setError(null);
                } else {
                    setError(response.message || 'Failed to load frequently bought products');
                    toast.error(response.message || 'Failed to load frequently bought products');
                }
            } catch (err) {
                setError('Failed to load frequently bought products');
                toast.error('Failed to load frequently bought products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFrequentProducts();
    }, [productId]);

    if (loading) return <div className="py-6 text-center">Loading frequently bought products...</div>;
    if (error) return <div className="py-6 text-center text-red-500">{error}</div>;
    if (!frequentProducts.length) return null;

    return (
        <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">Frequently Bought Together</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {frequentProducts
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
                                {product.coPurchaseCount && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Bought together {product.coPurchaseCount} times
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;