// controllers/productController.js
const { Product, Review, User, Category, sequelize } = require('../models'); // Đảm bảo User và Category được import

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            where: { isActive: true },
            include: [
                {
                    model: Review,
                    as: 'reviews', // SỬA Ở ĐÂY: Thêm alias 'reviews'
                    attributes: ['rating'] // Chỉ lấy rating để tính trung bình nếu cần
                },
                {
                    model: Category,
                    as: 'category', // Đảm bảo alias này khớp với định nghĩa trong Product.associate
                    attributes: ['id', 'name']
                }
            ],
            // Cân nhắc việc tính averageRating ở DB hoặc lưu trữ sẵn trong Product model
        });

        // Tính toán averageRating thủ công nếu không làm ở DB hoặc hook
        // Lưu ý: product.reviews (chữ thường) sẽ là tên thuộc tính chứa mảng các review
        const productsWithRating = products.map(product => {
            const productJson = product.toJSON();
            let averageRating = 0;
            if (productJson.reviews && productJson.reviews.length > 0) { // Sử dụng productJson.reviews
                const totalRating = productJson.reviews.reduce((acc, review) => acc + review.rating, 0);
                averageRating = totalRating / productJson.reviews.length;
            }
            return {
                ...productJson,
                reviews: undefined, // Xóa mảng reviews chi tiết nếu chỉ cần averageRating ở list view
                averageRating: parseFloat(averageRating.toFixed(2)) // Làm tròn 2 chữ số thập phân
            };
        });

        res.json(productsWithRating);
    } catch (error) {
        console.error('Error fetching products:', error);
        // res.status(500).json({ message: 'Error fetching products.', error: error.message });
        next(error); // Chuyển lỗi cho errorHandler chung
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            // where: { isActive: true }, // findByPk không dùng where trực tiếp, kiểm tra isActive sau
            include: [
                {
                    model: Review,
                    as: 'reviews', // SỬA Ở ĐÂY: Thêm alias 'reviews'
                    include: [{
                        model: User,
                        as: 'user', // SỬA Ở ĐÂY: Thêm alias 'user' cho mối quan hệ Review -> User
                        attributes: ['id', 'name', 'image']
                    }],
                    where: { isActive: true }, // Chỉ lấy review active
                    required: false // LEFT JOIN để vẫn lấy product dù không có review active
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!product || !product.isActive) { // Kiểm tra sản phẩm tồn tại và active
            return res.status(404).json({ message: 'Product not found or not active.' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        // res.status(500).json({ message: 'Error fetching product.', error: error.message });
        next(error);
    }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, image, categoryId, title, images, quantity /* ... các trường khác */ } = req.body;

        const category = await Category.findByPk(categoryId);
        if (!category || !category.isActive) {
            return res.status(400).json({ message: 'Category not found or not active.' });
        }

        const productData = {
            name,
            description,
            price,
            stock: stock || quantity || 0,
            image,
            images,
            categoryId,
            title: title || name,
            isActive: true,
            // Khởi tạo averageRating và numReviews nếu bạn lưu trữ chúng trong model Product
            averageRating: 0,
            numReviews: 0
        };
        // Thêm các trường khác từ req.body nếu có và hợp lệ
        // Ví dụ: productData.isNew = req.body.isNew || false;

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        // if (error.name === 'SequelizeValidationError') {
        //     return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        // }
        // res.status(500).json({ message: 'Error creating product.', error: error.message });
        next(error);
    }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product || !product.isActive) { // Chỉ cho phép cập nhật sản phẩm active
            return res.status(404).json({ message: 'Product not found or not active.' });
        }

        const { categoryId, ...updateData } = req.body;

        if (categoryId && categoryId !== product.categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category || !category.isActive) {
                return res.status(400).json({ message: 'New category not found or not active.' });
            }
            updateData.categoryId = categoryId;
        } else if (categoryId === null && product.categoryId !== null) {
             updateData.categoryId = null;
        }
        
        // Cập nhật các trường khác
        // Ví dụ: updateData.name = req.body.name || product.name; ...

        await product.update(updateData);
        
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        // if (error.name === 'SequelizeValidationError') {
        //     return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        // }
        // res.status(500).json({ message: 'Error updating product.', error: error.message });
        next(error);
    }
};

// @desc    Delete a product (Admin only) - Soft delete
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        await product.update({ isActive: false });
        res.json({ message: 'Product deactivated successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        // res.status(500).json({ message: 'Error deactivating product.', error: error.message });
        next(error);
    }
};

// @desc    Create new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private (User must be logged in)
const createProductReview = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;

        if (rating === undefined || rating === null || rating < 1 || rating > 5) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Rating is required and must be between 1 and 5.'});
        }

        const product = await Product.findByPk(productId, { transaction });

        if (!product || !product.isActive) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found or not active.' });
        }

        const alreadyReviewed = await Review.findOne({
            where: {
                productId: productId,
                userId: userId
            },
            transaction
        });

        if (alreadyReviewed) {
            await transaction.rollback();
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        const newReview = await Review.create({
            rating: Number(rating),
            comment,
            productId: productId,
            userId: userId,
            isVerified: false, 
            isActive: true
        }, { transaction });
        
        // Cập nhật averageRating và numReviews cho sản phẩm
        const reviews = await Review.findAll({ 
            where: { productId: productId, isActive: true },
            attributes: ['rating'],
            transaction 
        });

        const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
        product.numReviews = reviews.length;
        product.averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(2)) : 0;
        
        await product.save({ transaction });
        await transaction.commit();

        res.status(201).json(newReview);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating product review:', error);
        // if (error.name === 'SequelizeValidationError') {
        //     return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        // }
        // res.status(500).json({ message: 'Error creating product review.', error: error.message });
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
};
