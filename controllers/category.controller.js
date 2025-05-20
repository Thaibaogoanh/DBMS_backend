// controllers/category.controller.js
const { Category, Product } = require('../models'); // Import từ models/index.js

// Get all categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'description', 'image', 'parentId'] // Thêm parentId nếu cần
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories.', error: error.message });
        // Hoặc: next(error);
    }
};

// Get category by ID
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            // where: { isActive: true }, // Điều kiện này có thể không cần nếu findByPk đã đủ
            attributes: ['id', 'name', 'description', 'image', 'parentId']
        });

        if (!category || !category.isActive) { // Kiểm tra cả tồn tại và isActive
            return res.status(404).json({ message: 'Category not found or not active.' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Error fetching category.', error: error.message });
        // Hoặc: next(error);
    }
};

// Get products in category
const getCategoryProducts = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId, {
            where: { isActive: true } // Đảm bảo category đang active
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found or not active.' });
        }

        const products = await Product.findAll({
            where: { 
                categoryId: categoryId, // Sử dụng categoryId đã lấy được
                isActive: true 
            },
            attributes: ['id', 'name', 'price', 'image', 'stock', 'averageRating'] // Thêm averageRating nếu có
            // include: [{ model: Review, attributes: [] }] // Nếu cần tính averageRating ở đây
        });

        res.json(products); // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Error fetching category products:', error);
        res.status(500).json({ message: 'Error fetching category products.', error: error.message });
        // Hoặc: next(error);
    }
};

// Create new category (Admin only)
const createCategory = async (req, res, next) => {
    try {
        const { name, description, image, parentId } = req.body;

        // Kiểm tra xem category đã tồn tại chưa (theo tên)
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists.' });
        }

        // Nếu có parentId, kiểm tra xem parent category có tồn tại không
        if (parentId) {
            const parentCategory = await Category.findByPk(parentId);
            if (!parentCategory || !parentCategory.isActive) {
                return res.status(400).json({ message: 'Parent category not found or not active.' });
            }
        }

        const category = await Category.create({
            name,
            description,
            image,
            parentId, // Thêm parentId
            isActive: true
        });

        res.status(201).json({
            message: 'Category created successfully.',
            category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error creating category.', error: error.message });
        // Hoặc: next(error);
    }
};

// Update category (Admin only)
const updateCategory = async (req, res, next) => {
    try {
        const { name, description, image, parentId, isActive } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Kiểm tra tên mới có bị trùng với category khác không (trừ chính nó)
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ where: { name } });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category name already exists.' });
            }
        }

        // Nếu có parentId, kiểm tra xem parent category có tồn tại không và không phải là chính nó hoặc con của nó
        if (parentId) {
            if (parentId === category.id) {
                return res.status(400).json({ message: 'Category cannot be its own parent.' });
            }
            const parentCategory = await Category.findByPk(parentId);
            if (!parentCategory || !parentCategory.isActive) {
                return res.status(400).json({ message: 'Parent category not found or not active.' });
            }
            // Nâng cao: Kiểm tra vòng lặp cha-con (category không thể là cha của chính nó qua nhiều cấp)
        }


        await category.update({
            name: name || category.name,
            description: description || category.description,
            image: image || category.image,
            parentId: parentId !== undefined ? parentId : category.parentId, // Cho phép đặt parentId là null
            isActive: typeof isActive === 'boolean' ? isActive : category.isActive
        });

        res.json({
            message: 'Category updated successfully.',
            category
        });
    } catch (error) {
        console.error('Error updating category:', error);
         if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Error updating category.', error: error.message });
        // Hoặc: next(error);
    }
};

// Delete category (Admin only) - Soft delete
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Kiểm tra xem category có sản phẩm nào đang active không
        const productCount = await Product.count({ 
            where: { categoryId: category.id, isActive: true } 
        });
        if (productCount > 0) {
            return res.status(400).json({
                message: 'Cannot deactivate category with active products. Please reassign or deactivate products first.',
                productCount
            });
        }
        
        // Kiểm tra xem category có sub-categories đang active không
        const activeSubCategoryCount = await Category.count({
            where: { parentId: category.id, isActive: true}
        });
        if(activeSubCategoryCount > 0) {
            return res.status(400).json({
                message: 'Cannot deactivate category with active sub-categories. Please reassign or deactivate sub-categories first.',
                activeSubCategoryCount
            });
        }


        // Soft delete bằng cách cập nhật isActive: false
        await category.update({ isActive: false });

        res.json({ message: 'Category deactivated successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deactivating category.', error: error.message });
        // Hoặc: next(error);
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    getCategoryProducts,
    createCategory,
    updateCategory,
    deleteCategory
};
