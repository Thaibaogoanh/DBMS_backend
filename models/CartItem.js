// models/CartItem.js
module.exports = (sequelize, DataTypes) => {
    // Sử dụng instance 'sequelize' được truyền vào từ models/index.js
    const CartItem = sequelize.define('CartItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        cartId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Carts', // Tham chiếu đến bảng 'Carts'
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Products', // Tham chiếu đến bảng 'Products'
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1 // Số lượng ít nhất là 1
            }
        },
        price: { // Giá tại thời điểm thêm vào giỏ hàng
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        timestamps: true,
        indexes: [
            {
                fields: ['cartId']
            },
            {
                fields: ['productId']
            },
            {
                unique: true, // Đảm bảo mỗi sản phẩm chỉ xuất hiện 1 lần trong 1 giỏ hàng (cập nhật quantity thay vì thêm dòng mới)
                fields: ['cartId', 'productId']
            }
        ]
    });

    CartItem.associate = (models) => {
        // Một CartItem thuộc về một Cart
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cartId',
            as: 'cart'
        });

        // Một CartItem thuộc về một Product
        CartItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return CartItem; // Trả về model đã được define
};
