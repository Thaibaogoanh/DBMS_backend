CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imageUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ProductReviews (
  id SERIAL PRIMARY KEY,          -- Mã đánh giá (Khóa chính)
  phone_number VARCHAR(15) NOT NULL,          -- Số điện thoại của người dùng (Khóa ngoại, liên kết với bảng Users)
  product_id INT NOT NULL,                    -- Mã sản phẩm (Khóa ngoại, liên kết với bảng Sản phẩm)
  rating INT CHECK (rating >= 1 AND rating <= 5),  -- Điểm đánh giá từ 1 đến 5
  review_text TEXT,                           -- Nhận xét của người dùng (nếu có)
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian đánh giá
  image_url VARCHAR(255),                     -- Đường dẫn đến hình ảnh (nếu có)
  FOREIGN KEY (phone_number) REFERENCES Users(phone_number) ON DELETE CASCADE,  -- Ràng buộc khóa ngoại với bảng Users
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE  -- Ràng buộc khóa ngoại với bảng Products
);

