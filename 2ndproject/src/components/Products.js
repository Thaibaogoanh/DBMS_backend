import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ products }) => {
    if (!Array.isArray(products)) {
        return <div className="text-center text-red-500">Invalid products data</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                >
                    <div className="p-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                            {product.name}
                        </h3>
                        <p className="text-gray-600">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </p>
                        {product.description && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                {product.description}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Products;