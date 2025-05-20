// models/Cart.js
module.exports = (sequelize, DataTypes) => {
    // Sử dụng instance 'sequelize' được truyền vào từ models/index.js
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users', // Tham chiếu đến bảng 'Users'
                key: 'id'
            }
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        itemCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        indexes: [
            {
                unique: true, // Mỗi user chỉ nên có 1 cart active
                fields: ['userId', 'isActive'],
                where: {
                    isActive: true
                }
            }
        ]
    });

    Cart.associate = (models) => {
        // Một Cart thuộc về một User
        Cart.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        // Một Cart có nhiều CartItems
        Cart.hasMany(models.CartItem, {
            foreignKey: 'cartId',
            as: 'items'
        });
    };

    return Cart; // Trả về model đã được define
};
