CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');

CREATE TABLE Users (
  phone_number VARCHAR(15) PRIMARY KEY,      -- Số điện thoại làm khóa chính
  username VARCHAR(255) NOT NULL,             -- Tên đăng nhập
  full_name VARCHAR(255) NOT NULL,            -- Họ và tên
  email VARCHAR(255) UNIQUE NOT NULL,         -- Email
  password VARCHAR(255) NOT NULL,             -- Mật khẩu
  birth_date DATE,                            -- Ngày sinh
  gender gender_enum,    -- Giới tính
  is_seller BOOLEAN DEFAULT FALSE,            -- Có phải người bán hay không
  avatar_url VARCHAR(255),                    -- Đường dẫn đến ảnh đại diện
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời gian cập nhật
);

-- Tạo trigger để cập nhật trường `updated_at` mỗi khi có thay đổi
CREATE OR REPLACE FUNCTION update_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP; 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger trên bảng Users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
