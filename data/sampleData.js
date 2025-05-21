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
    const catElectronicsId = uuidv4(); // Vẫn giữ category gốc
    const catClothingId = uuidv4();    // ID cho "Thời trang"
    const catBooksId = uuidv4();       // Vẫn giữ category gốc
    // Cấp 2 - Điện tử (Sẽ không có sản phẩm nào thuộc các category này)
    const catLaptopsId = uuidv4();
    const catSmartphonesId = uuidv4();
    // Cấp 2 - Thời trang
    const catShirtsId = uuidv4();
    const catJeansId = uuidv4();
    const catDressesId = uuidv4();
    const catJacketsId = uuidv4();
    const catAccessoriesId = uuidv4(); // Phụ kiện thời trang

    const categories = [
        // Cấp 1
        { id: catElectronicsId, name: 'Điện tử', description: 'Các thiết bị điện tử và phụ kiện.', image: 'https://placehold.co/300x200?text=Dien+Tu' },
        { id: catClothingId, name: 'Thời trang', description: 'Quần áo và phụ kiện thời trang.', image: 'https://placehold.co/300x200?text=Thoi+Trang' },
        { id: catBooksId, name: 'Sách', description: 'Các loại sách và truyện.', image: 'https://placehold.co/300x200?text=Sach' },
        // Cấp 2 - Điện tử (Vẫn giữ để thể hiện cấu trúc, dù không có sản phẩm)
        { id: catLaptopsId, name: 'Máy tính xách tay', description: 'Laptop cho công việc và giải trí.', image: 'https://placehold.co/300x200?text=Laptop', parentId: catElectronicsId },
        { id: catSmartphonesId, name: 'Điện thoại thông minh', description: 'Các dòng điện thoại mới nhất.', image: 'https://placehold.co/300x200?text=Smartphone', parentId: catElectronicsId },
        // Cấp 2 - Thời trang
        { id: catShirtsId, name: 'Áo sơ mi', description: 'Áo sơ mi nam nữ.', image: 'https://placehold.co/300x200?text=Ao+So+Mi', parentId: catClothingId },
        { id: catJeansId, name: 'Quần Jeans', description: 'Quần jeans thời trang nam nữ.', image: 'https://placehold.co/300x200?text=Quan+Jeans', parentId: catClothingId },
        { id: catDressesId, name: 'Váy Đầm', description: 'Váy đầm dự tiệc và dạo phố.', image: 'https://placehold.co/300x200?text=Vay+Dam', parentId: catClothingId },
        { id: catJacketsId, name: 'Áo Khoác', description: 'Áo khoác giữ ấm và thời trang.', image: 'https://placehold.co/300x200?text=Ao+Khoac', parentId: catClothingId },
        { id: catAccessoriesId, name: 'Phụ kiện', description: 'Phụ kiện thời trang như mũ, túi xách, thắt lưng.', image: 'https://placehold.co/300x200?text=Phu+Kien', parentId: catClothingId },
    ];

    // --- PRODUCTS ---
    // ID cho sản phẩm thời trang (1 sản phẩm áo sơ mi có sẵn + 10 sản phẩm mới)
    const prodShirt1Id = uuidv4();
    const prodFashionShirt2Id = uuidv4();
    const prodFashionJean1Id = uuidv4();
    const prodFashionJean2Id = uuidv4();
    const prodFashionDress1Id = uuidv4();
    const prodFashionDress2Id = uuidv4();
    const prodFashionJacket1Id = uuidv4();
    const prodFashionJacket2Id = uuidv4();
    const prodFashionHat1Id = uuidv4();
    const prodFashionBag1Id = uuidv4();
    const prodFashionBelt1Id = uuidv4();

    const products = [
        // SẢN PHẨM THỜI TRANG
        { id: prodShirt1Id, title: 'Áo Sơ Mi Lụa Cao Cấp', name: 'Áo Sơ Mi Lụa Cao Cấp', description: 'Chất liệu lụa mềm mại, thoáng mát.', price: 750000, stock: 50, categoryId: catShirtsId, image: 'https://cdn.kkfashion.vn/18179-home_default/ao-so-mi-nu-cong-so-basic-tay-dai-asm11-22.jpg', averageRating: 0, numReviews: 0 },
        { id: prodFashionShirt2Id, title: 'Áo Sơ Mi Kẻ Caro Năng Động', name: 'Áo Sơ Mi Kẻ Caro Năng Động', description: 'Họa tiết kẻ caro trẻ trung, chất liệu cotton thấm hút mồ hôi.', price: 480000, stock: 60, categoryId: catShirtsId, image: 'https://salt.tikicdn.com/cache/w1200/ts/product/b0/39/86/7595f7ce0f4c89388adbd6c6e11897d6.jpg', averageRating: 0, numReviews: 0, isNew: true },
        { id: prodFashionJean1Id, title: 'Quần Jeans Nữ Skinny Co Giãn', name: 'Quần Jeans Nữ Skinny Co Giãn', description: 'Form skinny tôn dáng, chất liệu jean co giãn thoải mái vận động.', price: 620000, stock: 45, categoryId: catJeansId, image: 'https://th.bing.com/th/id/OIP.vamjwH5nDcOFIMFuM55TSAHaLG?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0, isFeatured: true },
        { id: prodFashionJean2Id, title: 'Quần Jeans Nam Slim Fit Cổ Điển', name: 'Quần Jeans Nam Slim Fit Cổ Điển', description: 'Kiểu dáng slim fit hiện đại, màu xanh denim truyền thống.', price: 790000, stock: 30, categoryId: catJeansId, image: 'https://th.bing.com/th/id/OIP.Uo-e-md1Bt2IXxic8EG5rwHaJ4?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0, isNew: true },
        { id: prodFashionDress1Id, title: 'Váy Hoa Nhí Vintage Mùa Hè', name: 'Váy Hoa Nhí Vintage Mùa Hè', description: 'Họa tiết hoa nhí dễ thương, chất voan nhẹ nhàng cho ngày hè.', price: 850000, stock: 25, categoryId: catDressesId, image: 'https://th.bing.com/th/id/OIP.hpyj1oQnc7ACCrwv-BV90AHaJ4?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0, isFeatured: true },
        { id: prodFashionDress2Id, title: 'Đầm Dạ Hội Đuôi Cá Sang Trọng', name: 'Đầm Dạ Hội Đuôi Cá Sang Trọng', description: 'Thiết kế đuôi cá quyến rũ, chất liệu ren cao cấp.', price: 2200000, stock: 10, categoryId: catDressesId, image: 'https://product.hstatic.net/1000318527/product/141279554_2759566720950868_4151769136115659930_o_7f872a3e6d624b05a5ea7652f97d415f_master.jpg', averageRating: 0, numReviews: 0 },
        { id: prodFashionJacket1Id, title: 'Áo Khoác Bomber Unisex Phong Cách', name: 'Áo Khoác Bomber Unisex Phong Cách', description: 'Áo khoác bomber cá tính, phù hợp cho cả nam và nữ.', price: 950000, stock: 33, categoryId: catJacketsId, image: 'https://th.bing.com/th/id/OIP.C1eJqC7tsgCJVjcoFthyGgHaHa?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0, isNew: true },
        { id: prodFashionJacket2Id, title: 'Áo Khoác Dạ Nữ Dáng Dài Hàn Quốc', name: 'Áo Khoác Dạ Nữ Dáng Dài Hàn Quốc', description: 'Giữ ấm hiệu quả, phong cách thanh lịch chuẩn Hàn.', price: 1800000, stock: 18, categoryId: catJacketsId, image: 'https://th.bing.com/th/id/R.546f23b70e6b5183a6b8671c24f9361f?rik=bE%2bRQxytFnDcDw&pid=ImgRaw&r=0', averageRating: 0, numReviews: 0 },
        { id: prodFashionHat1Id, title: 'Mũ Lưỡi Trai Thêu Chữ Basic', name: 'Mũ Lưỡi Trai Thêu Chữ Basic', description: 'Phụ kiện không thể thiếu, dễ phối đồ.', price: 250000, stock: 70, categoryId: catAccessoriesId, image: 'https://cf.shopee.vn/file/afb91fe401164e195dbaee2ffcdf5e0d', averageRating: 0, numReviews: 0, isFeatured: true },
        { id: prodFashionBag1Id, title: 'Túi Tote Vải Canvas In Hình', name: 'Túi Tote Vải Canvas In Hình', description: 'Túi xách tiện lợi, thân thiện môi trường, họa tiết độc đáo.', price: 320000, stock: 40, categoryId: catAccessoriesId, image: 'https://th.bing.com/th/id/OIP.P72vSe3bdaqhYGiHwKd9JAHaHa?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0, isNew: true },
        { id: prodFashionBelt1Id, title: 'Thắt Lưng Da Nam Mặt Khóa Kim Loại', name: 'Thắt Lưng Da Nam Mặt Khóa Kim Loại', description: 'Chất liệu da thật, mặt khóa kim loại sang trọng.', price: 550000, stock: 22, categoryId: catAccessoriesId, image: 'https://th.bing.com/th/id/OIP.rI0sJTGRAOeORePBIL3gJAHaHa?rs=1&pid=ImgDetMain', averageRating: 0, numReviews: 0 },
    ];

    // Các phần REVIEWS, ORDERS, ORDER ITEMS có thể được thêm sau nếu cần
    
    return { users, categories, products };
};

module.exports = sampleData;