// data/sampleData.js
// Bạn nên tạo file này trong thư mục gốc của dự án hoặc một thư mục con như 'data' hoặc 'seeders'
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Để tạo ID nếu model không tự tạo

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

const sampleData = async () => {
    const hashedPasswordAdmin = await hashPassword('admin123');
    const hashedPasswordUser1 = await hashPassword('user1pass');
    const hashedPasswordUser2 = await hashPassword('user2pass');

    // --- USERS ---
    const users = [
        { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Admin User', email: 'admin@example.com', password: hashedPasswordAdmin, role: 'admin', phone: '0123456789', address: '1 Admin Way' },
        { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', name: 'Alice Wonderland', email: 'alice@example.com', password: hashedPasswordUser1, role: 'user', phone: '0987654321', address: '123 Wonderland Ave' },
        { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', name: 'Bob The Builder', email: 'bob@example.com', password: hashedPasswordUser2, role: 'user', phone: '0912345678', address: '456 Construction Rd' },
    ];

    // --- CATEGORIES ---
    // Cấp 1
    const catElectronicsId = uuidv4();
    const catClothingId = uuidv4();
    const catBooksId = uuidv4();
    // Cấp 2
    const catLaptopsId = uuidv4();
    const catSmartphonesId = uuidv4();
    const catShirtsId = uuidv4();

    const categories = [
        // Cấp 1
        { id: catElectronicsId, name: 'Điện tử', description: 'Các thiết bị điện tử và phụ kiện.', image: 'https://placehold.co/300x200?text=Dien+Tu' },
        { id: catClothingId, name: 'Thời trang', description: 'Quần áo và phụ kiện thời trang.', image: 'https://placehold.co/300x200?text=Thoi+Trang' },
        { id: catBooksId, name: 'Sách', description: 'Các loại sách và truyện.', image: 'https://placehold.co/300x200?text=Sach' },
        // Cấp 2
        { id: catLaptopsId, name: 'Máy tính xách tay', description: 'Laptop cho công việc và giải trí.', image: 'https://placehold.co/300x200?text=Laptop', parentId: catElectronicsId },
        { id: catSmartphonesId, name: 'Điện thoại thông minh', description: 'Các dòng điện thoại mới nhất.', image: 'https://placehold.co/300x200?text=Smartphone', parentId: catElectronicsId },
        { id: catShirtsId, name: 'Áo sơ mi', description: 'Áo sơ mi nam nữ.', image: 'https://placehold.co/300x200?text=Ao+So+Mi', parentId: catClothingId },
    ];

    // --- PRODUCTS ---
    const prodLaptop1Id = uuidv4();
    const prodLaptop2Id = uuidv4();
    const prodPhone1Id = uuidv4();
    const prodShirt1Id = uuidv4();
    const prodBook1Id = uuidv4();

    const products = [
        { id: prodLaptop1Id, title: 'Laptop Pro Max 2025', name: 'Laptop Pro Max 2025', description: 'Siêu phẩm laptop với hiệu năng đỉnh cao.', price: 35000000, stock: 15, categoryId: catLaptopsId, image: 'https://placehold.co/600x400?text=Laptop+Pro+Max', images: ['https://placehold.co/600x400/EFEFEF/AAAAAA&text=Laptop1_1', 'https://placehold.co/600x400/EFEFEF/AAAAAA&text=Laptop1_2'], averageRating: 0, numReviews: 0, isNew: true, isFeatured: true },
        { id: prodLaptop2Id, title: 'Laptop Ultra Slim', name: 'Laptop Ultra Slim', description: 'Thiết kế mỏng nhẹ, tiện lợi di chuyển.', price: 22000000, stock: 25, categoryId: catLaptopsId, image: 'https://placehold.co/600x400?text=Laptop+Ultra+Slim', averageRating: 0, numReviews: 0, isNew: true },
        { id: prodPhone1Id, title: 'Smartphone X100', name: 'Smartphone X100', description: 'Điện thoại thông minh với camera siêu nét.', price: 18500000, stock: 30, categoryId: catSmartphonesId, image: 'https://placehold.co/600x400?text=Smartphone+X100', averageRating: 0, numReviews: 0, isFeatured: true },
        { id: prodShirt1Id, title: 'Áo Sơ Mi Lụa Cao Cấp', name: 'Áo Sơ Mi Lụa Cao Cấp', description: 'Chất liệu lụa mềm mại, thoáng mát.', price: 750000, stock: 50, categoryId: catShirtsId, image: 'https://placehold.co/600x400?text=Ao+So+Mi+Lua', averageRating: 0, numReviews: 0 },
        { id: prodBook1Id, title: 'Lập Trình Với Node.js', name: 'Lập Trình Với Node.js', description: 'Cẩm nang toàn diện về Node.js cho người mới bắt đầu và chuyên gia.', price: 250000, stock: 100, categoryId: catBooksId, image: 'https://placehold.co/600x400?text=Sach+NodeJS', averageRating: 0, numReviews: 0 },
    ];

    // --- REVIEWS ---
    // (Sẽ được tạo sau khi có User và Product, và cập nhật averageRating cho Product)
    // Ví dụ:
    // { userId: users[1].id, productId: products[0].id, rating: 5, comment: 'Sản phẩm tuyệt vời!' },
    // { userId: users[2].id, productId: products[0].id, rating: 4, comment: 'Khá tốt, nhưng giá hơi cao.' },

    // --- ORDERS & ORDER ITEMS ---
    // (Sẽ được tạo sau khi có User và Product)
    // Ví dụ:
    // const order1Id = uuidv4();
    // const orders = [
    //     { id: order1Id, userId: users[1].id, totalAmount: products[0].price * 1 + products[2].price * 1, shippingAddress: users[1].address, paymentMethod: 'COD', status: 'delivered', paymentStatus: 'completed' },
    // ];
    // const orderItems = [
    //     { orderId: order1Id, productId: products[0].id, quantity: 1, price: products[0].price, subtotal: products[0].price * 1 },
    //     { orderId: order1Id, productId: products[2].id, quantity: 1, price: products[2].price, subtotal: products[2].price * 1 },
    // ];
    
    return { users, categories, products /*, reviews, orders, orderItems */ };
};

module.exports = sampleData;

