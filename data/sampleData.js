// data/sampleData.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Bạn có thể dùng uuidv4() để tạo các ID này MỘT LẦN

// --- ID CỐ ĐỊNH CHO USERS ---
// Các ID này đã đúng định dạng UUID
const USER_ADMIN_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const USER_ALICE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
const USER_BOB_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
const USER_CHARLIE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';

// --- ID CỐ ĐỊNH CHO CATEGORIES ---
// Sửa lại: Loại bỏ tiền tố, đảm bảo là UUID hợp lệ
const CAT_SHIRTS_ID = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'; // Ví dụ, sử dụng UUID hợp lệ
const CAT_JEANS_ID = '2c9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee';
const CAT_DRESSES_ID = '3d9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bef';
const CAT_JACKETS_ID = '4e9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf0';
const CAT_ACCESSORIES_ID = '5f9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf1';
const CAT_SPORTSWEAR_ID = '6a9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf2';

// --- ID CỐ ĐỊNH CHO PRODUCTS ---
// Sửa lại: Loại bỏ tiền tố, đảm bảo là UUID hợp lệ
// Tôi sẽ dùng phần UUID từ log lỗi của bạn và bỏ tiền tố
const PROD_SHIRT_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000001'; // ID từ log lỗi của bạn (đã bỏ 'p1')
const PROD_FASHION_SHIRT_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000002'; // Tương tự
const PROD_TSHIRT_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000003';
const PROD_FASHION_JEAN_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000004';
const PROD_FASHION_JEAN_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000005';
const PROD_KAKI_SHORTS_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000006';
const PROD_FASHION_DRESS_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000007';
const PROD_FASHION_DRESS_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000008';
const PROD_FASHION_JACKET_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000009';
const PROD_FASHION_JACKET_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000010';
const PROD_FASHION_HAT_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000011'; // Đã sửa lại từ log lỗi của bạn cho Reviews
const PROD_FASHION_BAG_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000012';
const PROD_SPORT_SHIRT_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000013';
const PROD_SPORT_SHORTS_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000014';
// Sản phẩm mới để tạo kịch bản "similar products" - Cần UUID hợp lệ
const PROD_LINEN_SHIRT_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000015';
const PROD_GRAPHIC_TSHIRT_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000016';
const PROD_JEAN_RELAXED_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000017';


// --- ID CỐ ĐỊNH CHO REVIEWS, ORDERS, ORDERITEMS ---
// Sửa lại: Loại bỏ tiền tố, đảm bảo là UUID hợp lệ
const REVIEW_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000021'; // ID từ log lỗi của bạn (đã bỏ 'r1')
const REVIEW_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000022';
const REVIEW_3_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000023';
const REVIEW_4_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000024';
const REVIEW_5_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000025';
const REVIEW_6_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000026';
const REVIEW_7_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000027';
const REVIEW_8_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000028';


const ORDER_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000031';
const ORDER_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000032';
const ORDER_3_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000033';
const ORDER_4_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000034';

const ORDER_ITEM_1_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000041';
const ORDER_ITEM_2_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000042';
const ORDER_ITEM_3_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000043';
const ORDER_ITEM_4_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000044';
const ORDER_ITEM_5_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000045';
const ORDER_ITEM_6_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000046';
const ORDER_ITEM_7_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000047';
const ORDER_ITEM_8_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000048';
const ORDER_ITEM_9_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000049';
const ORDER_ITEM_10_ID = 'a0eebc99-9c0b-4ef8-bb6d-000000000050';


const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

const sampleData = async () => {
    const hashedPasswordAdmin = await hashPassword('admin123');
    const hashedPasswordUser1 = await hashPassword('user1pass');
    const hashedPasswordUser2 = await hashPassword('user2pass');
    const hashedPasswordUser3 = await hashPassword('user3pass');

    const users = [
        { id: USER_ADMIN_ID, name: 'Admin User', email: 'admin@example.com', password: hashedPasswordAdmin, role: 'admin', phone: '0123456789', address: '1 Admin Way, TP. HCM', image: 'https://placehold.co/150x150/7F7F7F/FFFFFF&text=Admin' },
        { id: USER_ALICE_ID, name: 'Alice Wonderland', email: 'alice@example.com', password: hashedPasswordUser1, role: 'user', phone: '0987654321', address: '123 Wonderland Ave, TP. HCM', image: 'https://placehold.co/150x150/FFC0CB/000000&text=Alice' },
        { id: USER_BOB_ID, name: 'Bob The Builder', email: 'bob@example.com', password: hashedPasswordUser2, role: 'user', phone: '0912345678', address: '456 Construction Rd, Hà Nội', image: 'https://placehold.co/150x150/ADD8E6/000000&text=Bob' },
        { id: USER_CHARLIE_ID, name: 'Charlie Brown', email: 'charlie@example.com', password: hashedPasswordUser3, role: 'user', phone: '0923456789', address: '789 Comic Strip, Đà Nẵng', image: 'https://placehold.co/150x150/FFFF00/000000&text=Charlie' },
    ];

    const categories = [
        { id: CAT_SHIRTS_ID, name: 'Áo sơ mi & Áo thun', description: 'Áo sơ mi, áo thun nam nữ đa dạng kiểu dáng.', image: 'https://placehold.co/300x200/F0E68C/000000&text=Ao+So+Mi', parentId: null, isActive: true },
        { id: CAT_JEANS_ID, name: 'Quần Jeans & Kaki', description: 'Quần jeans, quần kaki thời trang, bền đẹp.', image: 'https://placehold.co/300x200/B0E0E6/000000&text=Quan+Jeans', parentId: null, isActive: true },
        { id: CAT_DRESSES_ID, name: 'Váy Đầm & Chân váy', description: 'Váy đầm dự tiệc, dạo phố, công sở thanh lịch.', image: 'https://placehold.co/300x200/FFB6C1/000000&text=Vay+Dam', parentId: null, isActive: true },
        { id: CAT_JACKETS_ID, name: 'Áo Khoác', description: 'Áo khoác giữ ấm, chống nắng và thời trang.', image: 'https://placehold.co/300x200/D3D3D3/000000&text=Ao+Khoac', parentId: null, isActive: true },
        { id: CAT_ACCESSORIES_ID, name: 'Phụ kiện Thời trang', description: 'Mũ, túi, thắt lưng, trang sức.', image: 'https://placehold.co/300x200/FFE4B5/000000&text=Phu+Kien', parentId: null, isActive: true },
        { id: CAT_SPORTSWEAR_ID, name: 'Đồ Thể Thao', description: 'Quần áo và phụ kiện thể thao.', image: 'https://placehold.co/300x200/90EE90/000000&text=Do+The+Thao', parentId: null, isActive: true },
    ];

    const products = [
        // Shirts & T-shirts
        { id: PROD_SHIRT_1_ID, title: 'Áo Sơ Mi Lụa Cao Cấp Trắng', name: 'Áo Sơ Mi Lụa Trắng', description: 'Chất liệu lụa mềm mại, thoáng mát.', price: 750000, stock: 50, categoryId: CAT_SHIRTS_ID, image: 'https://cdn.kkfashion.vn/18179-home_default/ao-so-mi-nu-cong-so-basic-tay-dai-asm11-22.jpg', images: ['https://cdn.kkfashion.vn/18179-home_default/ao-so-mi-nu-cong-so-basic-tay-dai-asm11-22.jpg'], averageRating: 0, numReviews: 0, isNew: false, isFeatured: true, isActive: true, quantity: 50 },
        { id: PROD_FASHION_SHIRT_2_ID, title: 'Áo Sơ Mi Kẻ Caro Năng Động Xanh', name: 'Áo Sơ Mi Kẻ Caro Xanh', description: 'Họa tiết kẻ caro trẻ trung.', price: 480000, stock: 60, categoryId: CAT_SHIRTS_ID, image: 'https://salt.tikicdn.com/cache/w1200/ts/product/b0/39/86/7595f7ce0f4c89388adbd6c6e11897d6.jpg', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 60 },
        { id: PROD_TSHIRT_1_ID, title: 'Áo Thun Cotton Trơn Basic Unisex Đen', name: 'Áo Thun Cotton Đen', description: 'Áo thun cotton 100%, màu đen basic.', price: 200000, stock: 100, categoryId: CAT_SHIRTS_ID, image: 'https://placehold.co/600x400/333333/FFFFFF&text=Ao+Thun+Den', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: true, isActive: true, quantity: 100 },
        { id: PROD_LINEN_SHIRT_ID, title: 'Áo Sơ Mi Linen Tay Ngắn Trắng', name: 'Áo Sơ Mi Linen Trắng', description: 'Chất liệu linen thoáng mát, tay ngắn.', price: 520000, stock: 40, categoryId: CAT_SHIRTS_ID, image: 'https://placehold.co/600x400/F5F5F5/000000&text=Ao+Linen', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 40 },
        { id: PROD_GRAPHIC_TSHIRT_ID, title: 'Áo Thun Cotton In Họa Tiết Cool', name: 'Áo Thun Họa Tiết Cool', description: 'Áo thun cotton, in họa tiết độc đáo.', price: 220000, stock: 80, categoryId: CAT_SHIRTS_ID, image: 'https://placehold.co/600x400/C0C0C0/000000&text=Ao+Graphic', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 80 },
        // Jeans & Kaki
        { id: PROD_FASHION_JEAN_1_ID, title: 'Quần Jeans Nữ Skinny Co Giãn Xanh Đậm', name: 'Quần Jeans Nữ Skinny', description: 'Form skinny tôn dáng.', price: 650000, stock: 45, categoryId: CAT_JEANS_ID, image: 'https://th.bing.com/th/id/OIP.vamjwH5nDcOFIMFuM55TSAHaLG?rs=1&pid=ImgDetMain', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: true, isActive: true, quantity: 45 },
        { id: PROD_FASHION_JEAN_2_ID, title: 'Quần Jeans Nam Slim Fit Cổ Điển Đen', name: 'Quần Jeans Nam Slim Fit', description: 'Kiểu dáng slim fit hiện đại.', price: 720000, stock: 30, categoryId: CAT_JEANS_ID, image: 'https://th.bing.com/th/id/OIP.Uo-e-md1Bt2IXxic8EG5rwHaJ4?rs=1&pid=ImgDetMain', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 30 },
        { id: PROD_JEAN_RELAXED_ID, title: 'Quần Jeans Nam Relaxed Fit Xanh Nhạt', name: 'Quần Jeans Nam Relaxed', description: 'Form relaxed thoải mái, màu xanh nhạt.', price: 680000, stock: 35, categoryId: CAT_JEANS_ID, image: 'https://placehold.co/600x400/ADD8E6/000000&text=Jean+Relaxed', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 35 },
        { id: PROD_KAKI_SHORTS_ID, title: 'Quần Short Kaki Nam Beige', name: 'Quần Short Kaki Beige', description: 'Quần short kaki nam màu beige.', price: 350000, stock: 70, categoryId: CAT_JEANS_ID, image: 'https://placehold.co/600x400/F5F5DC/000000&text=Short+Kaki', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 70 },
        // Dresses
        { id: PROD_FASHION_DRESS_1_ID, title: 'Váy Hoa Nhí Vintage Mùa Hè Vàng', name: 'Váy Hoa Nhí Vàng', description: 'Họa tiết hoa nhí dễ thương.', price: 850000, stock: 25, categoryId: CAT_DRESSES_ID, image: 'https://th.bing.com/th/id/OIP.hpyj1oQnc7ACCrwv-BV90AHaJ4?rs=1&pid=ImgDetMain', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: true, isActive: true, quantity: 25 },
        { id: PROD_FASHION_DRESS_2_ID, title: 'Đầm Dạ Hội Đuôi Cá Sang Trọng Đỏ', name: 'Đầm Dạ Hội Đỏ', description: 'Thiết kế đuôi cá quyến rũ.', price: 2200000, stock: 10, categoryId: CAT_DRESSES_ID, image: 'https://product.hstatic.net/1000318527/product/141279554_2759566720950868_4151769136115659930_o_7f872a3e6d624b05a5ea7652f97d415f_master.jpg', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: false, isActive: true, quantity: 10 },
        // Jackets
        { id: PROD_FASHION_JACKET_1_ID, title: 'Áo Khoác Bomber Unisex Phong Cách Rêu', name: 'Áo Khoác Bomber Rêu', description: 'Áo khoác bomber cá tính.', price: 950000, stock: 33, categoryId: CAT_JACKETS_ID, image: 'https://th.bing.com/th/id/OIP.C1eJqC7tsgCJVjcoFthyGgHaHa?rs=1&pid=ImgDetMain', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: true, isActive: true, quantity: 33 },
        { id: PROD_FASHION_JACKET_2_ID, title: 'Áo Khoác Dạ Nữ Dáng Dài Hàn Quốc Be', name: 'Áo Khoác Dạ Nữ Be', description: 'Giữ ấm hiệu quả, phong cách thanh lịch.', price: 1800000, stock: 18, categoryId: CAT_JACKETS_ID, image: 'https://th.bing.com/th/id/R.546f23b70e6b5183a6b8671c24f9361f?rik=bE%2bRQxytFnDcDw&pid=ImgRaw&r=0', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: false, isActive: true, quantity: 18 },
        // Accessories
        { id: PROD_FASHION_HAT_1_ID, title: 'Mũ Lưỡi Trai Thêu Chữ Basic Đen', name: 'Mũ Lưỡi Trai Đen', description: 'Phụ kiện không thể thiếu.', price: 250000, stock: 70, categoryId: CAT_ACCESSORIES_ID, image: 'https://cf.shopee.vn/file/afb91fe401164e195dbaee2ffcdf5e0d', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: true, isActive: true, quantity: 70 },
        { id: PROD_FASHION_BAG_1_ID, title: 'Túi Tote Vải Canvas In Hình Cute', name: 'Túi Tote Canvas Cute', description: 'Túi xách tiện lợi, thân thiện môi trường.', price: 320000, stock: 40, categoryId: CAT_ACCESSORIES_ID, image: 'https://th.bing.com/th/id/OIP.P72vSe3bdaqhYGiHwKd9JAHaHa?rs=1&pid=ImgDetMain', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 40 },
        // Sportswear
        { id: PROD_SPORT_SHIRT_ID, title: 'Áo Thun Thể Thao Nam Dri-Fit', name: 'Áo Thun Thể Thao Nam', description: 'Chất liệu Dri-Fit thoáng khí.', price: 450000, stock: 55, categoryId: CAT_SPORTSWEAR_ID, image: 'https://placehold.co/600x400/87CEFA/000000&text=Ao+The+Thao', images: [], averageRating: 0, numReviews: 0, isNew: true, isFeatured: false, isActive: true, quantity: 55 },
        { id: PROD_SPORT_SHORTS_ID, title: 'Quần Short Thể Thao Nữ 2 Lớp', name: 'Quần Short Thể Thao Nữ', description: 'Thiết kế 2 lớp năng động.', price: 380000, stock: 65, categoryId: CAT_SPORTSWEAR_ID, image: 'https://placehold.co/600x400/FF69B4/FFFFFF&text=Quan+The+Thao', images: [], averageRating: 0, numReviews: 0, isNew: false, isFeatured: true, isActive: true, quantity: 65 },
    ];

    const reviews = [
        { id: REVIEW_1_ID, userId: USER_ALICE_ID, productId: PROD_SHIRT_1_ID, rating: 5, comment: 'Áo sơ mi lụa rất đẹp, vải mềm, mặc mát. Form chuẩn, giao hàng nhanh!', isActive: true, isVerified: true },
        { id: REVIEW_2_ID, userId: USER_BOB_ID, productId: PROD_SHIRT_1_ID, rating: 4, comment: 'Chất lượng tốt, nhưng mình thấy giá hơi cao so với một số shop khác.', isActive: true, isVerified: false },
        { id: REVIEW_3_ID, userId: USER_ALICE_ID, productId: PROD_FASHION_JEAN_1_ID, rating: 5, comment: 'Quần jeans co giãn tốt, mặc rất thoải mái. Sẽ ủng hộ shop tiếp!', isActive: true, isVerified: true },
        { id: REVIEW_4_ID, userId: USER_CHARLIE_ID, productId: PROD_FASHION_JEAN_1_ID, rating: 4, comment: 'Quần form đẹp, màu cũng ổn. Giao hàng hơi lâu chút.', isActive: true, isVerified: true },
        { id: REVIEW_5_ID, userId: USER_BOB_ID, productId: PROD_FASHION_DRESS_1_ID, rating: 5, comment: 'Váy xinh xỉu, họa tiết vintage đáng yêu. Mặc đi chơi ai cũng khen.', isActive: true, isVerified: true },
        { id: REVIEW_6_ID, userId: USER_CHARLIE_ID, productId: PROD_TSHIRT_1_ID, rating: 4, comment: 'Áo thun chất cotton xịn, mặc thích. Mong shop có thêm nhiều màu pastel.', isActive: true, isVerified: false },
        { id: REVIEW_7_ID, userId: USER_ALICE_ID, productId: PROD_SPORT_SHIRT_ID, rating: 5, comment: 'Áo thể thao mặc rất thích, thấm hút mồ hôi tốt.', isActive: true, isVerified: true },
        { id: REVIEW_8_ID, userId: USER_BOB_ID, productId: PROD_FASHION_JACKET_1_ID, rating: 4, comment: 'Áo khoác bomber chất ổn, form đẹp.', isActive: true, isVerified: true },
    ];

    const orders = [
        {
            id: ORDER_1_ID, userId: USER_ALICE_ID,
            totalAmount: (products.find(p => p.id === PROD_SHIRT_1_ID).price * 1) + (products.find(p => p.id === PROD_FASHION_JEAN_1_ID).price * 1),
            shippingAddress: users.find(u => u.id === USER_ALICE_ID).address, paymentMethod: 'COD', status: 'delivered', paymentStatus: 'completed', notes: 'Giao hàng giờ hành chính.', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: ORDER_2_ID, userId: USER_BOB_ID,
            totalAmount: (products.find(p => p.id === PROD_FASHION_JACKET_1_ID).price * 1) + (products.find(p => p.id === PROD_TSHIRT_1_ID).price * 2) + (products.find(p => p.id === PROD_FASHION_HAT_1_ID).price * 1),
            shippingAddress: users.find(u => u.id === USER_BOB_ID).address, paymentMethod: 'CreditCard', status: 'processing', paymentStatus: 'completed', trackingNumber: 'GHN123XYZ', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: ORDER_3_ID, userId: USER_CHARLIE_ID,
            totalAmount: (products.find(p => p.id === PROD_TSHIRT_1_ID).price * 1) + (products.find(p => p.id === PROD_FASHION_HAT_1_ID).price * 1) + (products.find(p => p.id === PROD_SPORT_SHORTS_ID).price * 1) + (products.find(p => p.id === PROD_FASHION_SHIRT_2_ID).price * 1),
            shippingAddress: users.find(u => u.id === USER_CHARLIE_ID).address, paymentMethod: 'BankTransfer', status: 'pending', paymentStatus: 'pending', notes: 'Vui lòng gọi trước khi giao.', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: ORDER_4_ID, userId: USER_ALICE_ID,
            totalAmount: (products.find(p => p.id === PROD_TSHIRT_1_ID).price * 3),
            shippingAddress: users.find(u => u.id === USER_ALICE_ID).address, paymentMethod: 'COD', status: 'shipped', paymentStatus: 'pending', trackingNumber: 'VTPOST456ABC', createdAt: new Date()
        }
    ];
    const orderItems = [
        // Order 1 (Alice)
        { id: ORDER_ITEM_1_ID, orderId: ORDER_1_ID, productId: PROD_SHIRT_1_ID, quantity: 1, price: products.find(p => p.id === PROD_SHIRT_1_ID).price, subtotal: products.find(p => p.id === PROD_SHIRT_1_ID).price * 1 },
        { id: ORDER_ITEM_2_ID, orderId: ORDER_1_ID, productId: PROD_FASHION_JEAN_1_ID, quantity: 1, price: products.find(p => p.id === PROD_FASHION_JEAN_1_ID).price, subtotal: products.find(p => p.id === PROD_FASHION_JEAN_1_ID).price * 1 },
        // Order 2 (Bob)
        { id: ORDER_ITEM_3_ID, orderId: ORDER_2_ID, productId: PROD_FASHION_JACKET_1_ID, quantity: 1, price: products.find(p => p.id === PROD_FASHION_JACKET_1_ID).price, subtotal: products.find(p => p.id === PROD_FASHION_JACKET_1_ID).price * 1 },
        { id: ORDER_ITEM_4_ID, orderId: ORDER_2_ID, productId: PROD_TSHIRT_1_ID, quantity: 2, price: products.find(p => p.id === PROD_TSHIRT_1_ID).price, subtotal: products.find(p => p.id === PROD_TSHIRT_1_ID).price * 2 },
        { id: ORDER_ITEM_9_ID, orderId: ORDER_2_ID, productId: PROD_FASHION_HAT_1_ID, quantity: 1, price: products.find(p => p.id === PROD_FASHION_HAT_1_ID).price, subtotal: products.find(p => p.id === PROD_FASHION_HAT_1_ID).price * 1 },
        // Order 3 (Charlie)
        { id: ORDER_ITEM_5_ID, orderId: ORDER_3_ID, productId: PROD_TSHIRT_1_ID, quantity: 1, price: products.find(p => p.id === PROD_TSHIRT_1_ID).price, subtotal: products.find(p => p.id === PROD_TSHIRT_1_ID).price * 1 },
        { id: ORDER_ITEM_6_ID, orderId: ORDER_3_ID, productId: PROD_FASHION_HAT_1_ID, quantity: 1, price: products.find(p => p.id === PROD_FASHION_HAT_1_ID).price, subtotal: products.find(p => p.id === PROD_FASHION_HAT_1_ID).price * 1 },
        { id: ORDER_ITEM_7_ID, orderId: ORDER_3_ID, productId: PROD_SPORT_SHORTS_ID, quantity: 1, price: products.find(p => p.id === PROD_SPORT_SHORTS_ID).price, subtotal: products.find(p => p.id === PROD_SPORT_SHORTS_ID).price * 1 },
        { id: ORDER_ITEM_10_ID, orderId: ORDER_3_ID, productId: PROD_FASHION_SHIRT_2_ID, quantity: 1, price: products.find(p => p.id === PROD_FASHION_SHIRT_2_ID).price, subtotal: products.find(p => p.id === PROD_FASHION_SHIRT_2_ID).price * 1 },
        // Order 4 (Alice)
        { id: ORDER_ITEM_8_ID, orderId: ORDER_4_ID, productId: PROD_TSHIRT_1_ID, quantity: 3, price: products.find(p => p.id === PROD_TSHIRT_1_ID).price, subtotal: products.find(p => p.id === PROD_TSHIRT_1_ID).price * 3 },
    ];

    return { users, categories, products, reviews, orders, orderItems };
};

module.exports = sampleData;
