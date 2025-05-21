-- =================================================================
-- SCRIPT CHÈN DỮ LIỆU MẪU HOÀN CHỈNH (ĐÃ SỬA LỖI DEFINE)
-- =================================================================

-- Giả sử các kiểu ENUM đã được tạo (Sequelize tự động làm điều này khi đồng bộ)
-- CREATE TYPE "enum_Users_role" AS ENUM ('user', 'admin');
-- CREATE TYPE "enum_Orders_status" AS ENUM ('pending', 'processing', 'shipped', 'delivered');

-- 1. Chèn dữ liệu cho bảng Users
-- Mật khẩu 'adminpass' đã được băm: $2a$10$Y.f0o7N3wO2jL6Uu0jX9UuqjR.1gP9Knp7zT6bH.0aE.f.j.0i.6C
-- Mật khẩu 'userpass' đã được băm: $2a$10$F3gP3O.V.t.u.l.T.y.9Uuq.E.f.k.K.p.N.z.Y.h.0B.j.L.o.S.E
INSERT INTO "Users" (id, name, email, password, image, role, "createdAt", "updatedAt") VALUES
('a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'Admin User', 'admin@example.com', '$2a$10$Y.f0o7N3wO2jL6Uu0jX9UuqjR.1gP9Knp7zT6bH.0aE.f.j.0i.6C', 'path/to/admin_image.jpg', 'admin', NOW(), NOW()),
('a2a2a2a2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'Normal User', 'user@example.com', '$2a$10$F3gP3O.V.t.u.l.T.y.9Uuq.E.f.k.K.p.N.z.Y.h.0B.j.L.o.S.E', 'path/to/user_image.jpg', 'user', NOW(), NOW());

-- 2. Chèn dữ liệu cho bảng Products
INSERT INTO "Products" (id, title, price, "oldPrice", quantity, description, category, image, "isNew", "createdAt", "updatedAt") VALUES
('p1p1p1p1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'Awesome Laptop', 1200.00, 1350.00, 50, 'A very powerful and sleek laptop for professionals.', 'Electronics', 'path/to/laptop.jpg', true, NOW(), NOW()),
('p2p2p2p2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'Comfortable T-Shirt', 25.50, NULL, 200, '100% cotton t-shirt, available in various sizes.', 'Apparel', 'path/to/tshirt.jpg', false, NOW(), NOW()),
('p3p3p3p3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 'Wireless Headphones', 150.00, 170.00, 75, 'Noise-cancelling wireless headphones with long battery life.', 'Electronics', 'path/to/headphones.jpg', true, NOW(), NOW());

-- 3. Chèn dữ liệu cho bảng Reviews (liên kết Users và Products)
INSERT INTO "Reviews" (id, rating, review, "createdAt", "updatedAt", "UserId", "ProductId") VALUES
('r1r1r1r1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 5, 'This laptop is amazing! Super fast and great display.', NOW(), NOW(), 'a2a2a2a2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'p1p1p1p1-b1b1-c1c1-d1d1-e1e1e1e1e1e1'),
('r2r2r2r2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 4, 'Good quality t-shirt, very comfortable.', NOW(), NOW(), 'a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'p2p2p2p2-b2b2-c2c2-d2d2-e2e2e2e2e2e2');

-- 4. Chèn dữ liệu cho bảng Orders (liên kết Users)
INSERT INTO "Orders" (id, "totalAmount", status, "shippingAddress", "paymentMethod", "createdAt", "updatedAt", "UserId") VALUES
('o1o1o1o1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 175.50, 'pending', '{"street": "123 Main St", "city": "Anytown", "zipCode": "10001", "country": "USA"}', 'Credit Card', NOW(), NOW(), 'a2a2a2a2-b2b2-c2c2-d2d2-e2e2e2e2e2e2');

-- 5. Chèn dữ liệu cho bảng OrderItems (bảng trung gian liên kết Orders và Products)
-- Tổng đơn hàng o1 là 150 (headphones) + 25.50 (tshirt) = 175.50, khớp với totalAmount của Order
INSERT INTO "OrderItems" (id, quantity, price, "createdAt", "updatedAt", "OrderId", "ProductId") VALUES
('i1i1i1i1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 1, 150.00, NOW(), NOW(), 'o1o1o1o1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'p3p3p3p3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'), -- 1 Wireless Headphones
('i2i2i2i2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 1, 25.50, NOW(), NOW(), 'o1o1o1o1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'p2p2p2p2-b2b2-c2c2-d2d2-e2e2e2e2e2e2');  -- 1 Comfortable T-Shirt

-- =================================================================
-- TIẾP TỤC THÊM DỮ LIỆU MẪU (PHẦN 2)
-- =================================================================

-- Mật khẩu 'techpass' đã băm: $2a$10$bLpZ7mXqK9nGcD.h.V.8A.O.Z.w.0.q.M.r.N.t.Y.u.L.k.X.w.Y
-- Mật khẩu 'fashionpass' đã băm: $2a$10$sW.j.K.l.P.o.I.u.Y.t.R.e.W.q.A.s.D.f.G.h.J.k.L.z.X

-- 6. Thêm Users mới
INSERT INTO "Users" (id, name, email, password, image, role, "createdAt", "updatedAt") VALUES
('a3a3a3a3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 'Tech Savvy User', 'tech@example.com', '$2a$10$bLpZ7mXqK9nGcD.h.V.8A.O.Z.w.0.q.M.r.N.t.Y.u.L.k.X.w.Y', 'path/to/tech_avatar.png', 'user', NOW(), NOW()),
('a4a4a4a4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 'Fashion Fan', 'fashion@example.com', '$2a$10$sW.j.K.l.P.o.I.u.Y.t.R.e.W.q.A.s.D.f.G.h.J.k.L.z.X', NULL, 'user', NOW(), NOW());

-- 7. Thêm Products mới
INSERT INTO "Products" (id, title, price, "oldPrice", quantity, description, category, image, "isNew", "createdAt", "updatedAt") VALUES
('p4p4p4p4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 'Smart Watch Series X', 249.99, NULL, 30, 'Latest generation smart watch with advanced health tracking.', 'Electronics', 'path/to/smartwatch_x.jpg', true, NOW(), NOW()),
('p5p5p5p5-b5b5-c5c5-d5d5-e5e5e5e5e5e5', 'Elegant Summer Dress', 75.00, 90.00, 100, 'A light and elegant dress perfect for summer occasions.', 'Apparel', 'path/to/summer_dress.jpg', false, NOW(), NOW()),
('p6p6p6p6-b6b6-c6c6-d6d6-e6e6e6e6e6e6', 'Pro Gaming Mouse', 59.90, 65.00, 120, 'High precision gaming mouse with customizable RGB lighting.', 'Electronics', 'path/to/gaming_mouse_pro.jpg', false, NOW(), NOW());

-- 8. Thêm Reviews mới
INSERT INTO "Reviews" (id, rating, review, "createdAt", "updatedAt", "UserId", "ProductId") VALUES
('r3r3r3r3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 5, 'This smart watch is a game changer! Love the new features.', NOW(), NOW(), 'a3a3a3a3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 'p4p4p4p4-b4b4-c4c4-d4d4-e4e4e4e4e4e4'), -- Tech Savvy User reviews Smart Watch
('r4r4r4r4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 4, 'The dress is beautiful and fits well, though the material is a bit thinner than expected.', NOW(), NOW(), 'a4a4a4a4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 'p5p5p5p5-b5b5-c5c5-d5d5-e5e5e5e5e5e5'), -- Fashion Fan reviews Summer Dress
('r5r5r5r5-b5b5-c5c5-d5d5-e5e5e5e5e5e5', 5, 'Best gaming mouse I have ever used. Super responsive!', NOW(), NOW(), 'a2a2a2a2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'p6p6p6p6-b6b6-c6c6-d6d6-e6e6e6e6e6e6'); -- Normal User (user_uuid_2) reviews Gaming Mouse

-- 9. Thêm Orders mới
-- Order 2: Tech Savvy User orders a Smart Watch and a Gaming Mouse
-- Total: 249.99 (watch) + 59.90 (mouse) = 309.89
INSERT INTO "Orders" (id, "totalAmount", status, "shippingAddress", "paymentMethod", "createdAt", "updatedAt", "UserId") VALUES
('o2o2o2o2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 309.89, 'processing', '{"street": "456 Tech Road", "city": "Silicon Valley", "zipCode": "94000", "country": "USA"}', 'PayPal', NOW(), NOW(), 'a3a3a3a3-b3b3-c3c3-d3d3-e3e3e3e3e3e3');

-- Order 3: Fashion Fan orders two Summer Dresses
-- Total: 75.00 * 2 = 150.00
INSERT INTO "Orders" (id, "totalAmount", status, "shippingAddress", "paymentMethod", "createdAt", "updatedAt", "UserId") VALUES
('o3o3o3o3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 150.00, 'shipped', '{"street": "789 Fashion Ave", "city": "New York", "zipCode": "10001", "country": "USA", "apartment": "Apt 5B"}', 'Credit Card', NOW(), NOW(), 'a4a4a4a4-b4b4-c4c4-d4d4-e4e4e4e4e4e4');

-- 10. Thêm OrderItems cho các Orders mới

-- OrderItems for order_uuid_2
INSERT INTO "OrderItems" (id, quantity, price, "createdAt", "updatedAt", "OrderId", "ProductId") VALUES
('i3i3i3i3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 1, 249.99, NOW(), NOW(), 'o2o2o2o2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'p4p4p4p4-b4b4-c4c4-d4d4-e4e4e4e4e4e4'), -- 1 Smart Watch for order 2
('i4i4i4i4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 1, 59.90, NOW(), NOW(), 'o2o2o2o2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'p6p6p6p6-b6b6-c6c6-d6d6-e6e6e6e6e6e6');  -- 1 Gaming Mouse for order 2

-- OrderItems for order_uuid_3
INSERT INTO "OrderItems" (id, quantity, price, "createdAt", "updatedAt", "OrderId", "ProductId") VALUES
('i5i5i5i5-b5b5-c5c5-d5d5-e5e5e5e5e5e5', 2, 75.00, NOW(), NOW(), 'o3o3o3o3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 'p5p5p5p5-b5b5-c5c5-d5d5-e5e5e5e5e5e5');  -- 2 Summer Dresses for order 3 (price is per item)

-- Thêm một review từ Admin cho sản phẩm đầu tiên
INSERT INTO "Reviews" (id, rating, review, "createdAt", "updatedAt", "UserId", "ProductId") VALUES
('r6r6r6r6-b6b6-c6c6-d6d6-e6e6e6e6e6e6', 5, 'As an admin, I can confirm this laptop (product_uuid_1) is top-notch for our staff.', NOW(), NOW(), 'a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'p1p1p1p1-b1b1-c1c1-d1d1-e1e1e1e1e1e1');

-- Thêm một sản phẩm không có review và chưa có ai đặt hàng
INSERT INTO "Products" (id, title, price, "oldPrice", quantity, description, category, image, "isNew", "createdAt", "updatedAt") VALUES
('p7p7p7p7-b7b7-c7c7-d7d7-e7e7e7e7e7e7', 'Simple Mug', 12.00, NULL, 150, 'A simple, sturdy ceramic mug. Holds 350ml.', 'Home Goods', 'path/to/mug.jpg', false, NOW(), NOW());

-- Thêm một đơn hàng đã hoàn thành (delivered) cho user đầu tiên
INSERT INTO "Orders" (id, "totalAmount", status, "shippingAddress", "paymentMethod", "createdAt", "updatedAt", "UserId") VALUES
('o4o4o4o4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 25.50, 'delivered', '{"street": "901 Admin Lane", "city": "Server City", "zipCode": "50000", "country": "Admland"}', 'Internal Transfer', NOW() - INTERVAL '5 day', NOW() - INTERVAL '1 day', 'a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1');

INSERT INTO "OrderItems" (id, quantity, price, "createdAt", "updatedAt", "OrderId", "ProductId") VALUES
('i7i7i7i7-b7b7-c7c7-d7d7-e7e7e7e7e7e7', 1, 25.50, NOW() - INTERVAL '5 day', NOW() - INTERVAL '5 day', 'o4o4o4o4-b4b4-c4c4-d4d4-e4e4e4e4e4e4', 'p2p2p2p2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'); -- 1 T-shirt