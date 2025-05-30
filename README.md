Backend Dự án Web Bán Quần Áo
Đây là dự án backend cho một ứng dụng web bán quần áo, được xây dựng bằng Node.js và Express.js. Hệ thống sử dụng PostgreSQL (với Sequelize ORM) làm cơ sở dữ liệu chính cho các dữ liệu giao dịch và Neo4j cho việc xây dựng hệ thống gợi ý sản phẩm thông minh.

Mục lục
Mô tả Dự án

Kiến trúc Tổng quan

Công nghệ Sử dụng

Yêu cầu Cài đặt (Prerequisites)

Hướng dẫn Cài đặt Chi tiết

Clone Repository

Cài đặt Dependencies

Thiết lập Biến Môi trường (.env)

Thiết lập Cơ sở dữ liệu PostgreSQL

Thiết lập Cơ sở dữ liệu Neo4j

Chạy Ứng dụng

Chèn Dữ liệu Mẫu (Seeding)

Cấu trúc Thư mục Dự án

Tổng quan API Endpoints

Các Chức năng Chính Chi tiết

Hướng dẫn Gỡ lỗi (Troubleshooting)

Đóng góp (Tùy chọn)

Giấy phép (Tùy chọn)

1. Mô tả Dự án
Dự án này là một hệ thống backend API RESTful được thiết kế để cung cấp nền tảng cho một website thương mại điện tử chuyên về các mặt hàng quần áo và phụ kiện thời trang. Nó bao gồm các chức năng thiết yếu như quản lý người dùng (xác thực, hồ sơ), quản lý toàn diện danh mục và sản phẩm, xử lý quy trình đặt hàng, cho phép người dùng đánh giá sản phẩm, và tích hợp một hệ thống gợi ý sản phẩm thông minh. Hệ thống gợi ý này được xây dựng dựa trên hành vi mua sắm của người dùng và các thuộc tính của sản phẩm, sử dụng cơ sở dữ liệu đồ thị Neo4j để phân tích mối quan hệ.

2. Kiến trúc Tổng quan
Kiến trúc Ứng dụng: Client-Server, với backend cung cấp các API RESTful.

Backend: Xây dựng trên nền tảng Node.js và framework Express.js.

Cơ sở dữ liệu:

PostgreSQL: Được sử dụng làm cơ sở dữ liệu quan hệ chính, lưu trữ thông tin về người dùng, danh mục, sản phẩm, đơn hàng, đánh giá, giỏ hàng. Tương tác qua Sequelize ORM.

Neo4j: Được sử dụng làm cơ sở dữ liệu đồ thị, lưu trữ các node (Người dùng, Sản phẩm, Danh mục) và các mối quan hệ (ví dụ: :PURCHASED, :BELONGS_TO, :IS_CHILD_OF) để phục vụ cho các thuật toán gợi ý phức tạp.

Xác thực & Phân quyền: Sử dụng JSON Web Tokens (JWT) để xác thực người dùng và phân quyền truy cập (User, Admin).

3. Công nghệ Sử dụng
Ngôn ngữ: JavaScript (Node.js)

Framework: Express.js

Cơ sở dữ liệu Quan hệ: PostgreSQL

ORM (cho PostgreSQL): Sequelize

Cơ sở dữ liệu Đồ thị: Neo4j

Driver Neo4j: neo4j-driver

Xác thực: JSON Web Tokens (jsonwebtoken)

Mã hóa Mật khẩu: bcryptjs

Quản lý Biến Môi trường: dotenv

Xử lý CORS: cors

Tạo ID Duy nhất: uuid (cho các ID cố định trong dữ liệu mẫu và có thể cho các bản ghi mới nếu không dùng DataTypes.UUIDV4 của Sequelize)

Quản lý Gói: npm (hoặc Yarn)

4. Yêu cầu Cài đặt (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các phần mềm sau trên máy của mình:

Node.js: Phiên bản 16.x trở lên (khuyến nghị LTS, bao gồm npm).

PostgreSQL: Phiên bản 12 trở lên.

Neo4j: Phiên bản 4.x hoặc 5.x (Neo4j Desktop được khuyến nghị để dễ quản lý và khởi chạy server).

Git: Để clone repository.

Công cụ quản lý CSDL:

Cho PostgreSQL: pgAdmin, DBeaver, hoặc psql CLI.

Cho Neo4j: Neo4j Browser (thường đi kèm Neo4j Desktop).

5. Hướng dẫn Cài đặt Chi tiết
Clone Repository
git clone <your-repository-url>
cd <project-directory-name> # Ví dụ: cd Btl

Cài đặt Dependencies
Cài đặt các gói Node.js cần thiết cho dự án:

npm install

Hoặc nếu bạn dùng Yarn:

yarn install

Thiết lập Biến Môi trường (.env)
Trong thư mục gốc của dự án (ví dụ: Btl/), tạo một file mới tên là .env.

Sao chép nội dung từ file .env.example (nếu có) hoặc điền các biến môi trường theo mẫu dưới đây. Đây là bước cực kỳ quan trọng.

# Application Configuration
PORT=5000
NODE_ENV=development # Đặt là 'development' khi phát triển, 'production' khi triển khai

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dbms # Tên database PostgreSQL của bạn
DB_USER=postgres # Username PostgreSQL của bạn
DB_PASSWORD=your_actual_strong_postgres_password # !!! THAY BẰNG MẬT KHẨU POSTGRESQL THỰC TẾ CỦA BẠN !!!

# JWT Configuration
JWT_SECRET=your_very_long_random_and_complex_jwt_secret_key_here_at_least_32_chars # !!! THAY BẰNG MỘT CHUỖI BÍ MẬT MẠNH VÀ NGẪU NHIÊN !!!
JWT_EXPIRES_IN=30d # Thời gian hết hạn token (ví dụ: '1h', '7d', '30d')

# Stripe Configuration (Bỏ qua nếu không sử dụng thanh toán Stripe)
# STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY 
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_STRIPE_WEBHOOK_SECRET

# Neo4j Database Configuration
NEO4J_URI=bolt://localhost:7687 # Hoặc 127.0.0.1, đảm bảo cổng khớp với Neo4j server của bạn
NEO4J_USER=neo4j # Username Neo4j của bạn
NEO4J_PASSWORD=your_actual_strong_neo4j_password # !!! THAY BẰNG MẬT KHẨU NEO4J THỰC TẾ CỦA BẠN !!!
NEO4J_DATABASE=neo4j # Tên cơ sở dữ liệu Neo4j bạn muốn kết nối tới (mặc định thường là 'neo4j')

# Seeding and Sync Flags (Chỉ nên dùng 'true' trong môi trường development khi cần thiết)
SEED_DB=false           # Đặt là 'true' để tự động chèn dữ liệu mẫu khi khởi động
DB_FORCE_SYNC=false     # Đặt là 'true' để XÓA và tạo lại bảng PostgreSQL khi khởi động (CẨN THẬN MẤT DỮ LIỆU!)
NEO4J_FORCE_SEED=false  # Đặt là 'true' để XÓA dữ liệu Neo4j cũ trước khi chèn dữ liệu mẫu (CẨN THẬN MẤT DỮ LIỆU!)

# CORS Configuration (Tùy chọn, cho phép truy cập từ frontend)
# CORS_ORIGIN=http://localhost:3000 # Địa chỉ của ứng dụng frontend của bạn

CẢNH BÁO BẢO MẬT:

TUYỆT ĐỐI KHÔNG commit file .env chứa các khóa bí mật và mật khẩu thực tế lên Git repository công khai.

Thêm .env vào file .gitignore của bạn.

Tạo một file .env.example với các biến và giá trị giữ chỗ để hướng dẫn các thành viên khác trong nhóm.

Sử dụng các mật khẩu mạnh và các chuỗi bí mật ngẫu nhiên, phức tạp cho DB_PASSWORD, JWT_SECRET, NEO4J_PASSWORD và các khóa Stripe.

Thiết lập Cơ sở dữ liệu PostgreSQL
Khởi động PostgreSQL Server: Đảm bảo dịch vụ PostgreSQL đang chạy trên máy của bạn.

Tạo Database:

Sử dụng một công cụ quản lý CSDL (như pgAdmin, DBeaver) hoặc psql CLI.

Tạo một database mới với tên đã được định nghĩa trong DB_NAME của file .env (ví dụ: dbms).

Lệnh SQL ví dụ: CREATE DATABASE dbms;

Quyền User: Đảm bảo user PostgreSQL (DB_USER trong .env) có đủ quyền (thường là quyền sở hữu hoặc các quyền CREATE, SELECT, INSERT, UPDATE, DELETE) trên database vừa tạo.

Thiết lập Cơ sở dữ liệu Neo4j
Khởi động Neo4j Server:

Nếu sử dụng Neo4j Desktop, hãy khởi động DBMS (Graph Database) tương ứng.

Đảm bảo server Neo4j đang chạy và lắng nghe trên URI và cổng được định nghĩa trong NEO4J_URI (thường là bolt://localhost:7687).

Kiểm tra User và Password: Đảm bảo NEO4J_USER và NEO4J_PASSWORD trong file .env khớp với thông tin đăng nhập của Neo4j DBMS. Mật khẩu mặc định của user neo4j thường là neo4j khi mới cài đặt, bạn nên đổi nó.

Database Name: Nếu bạn sử dụng một database cụ thể khác với database neo4j mặc định, hãy cập nhật biến NEO4J_DATABASE trong file .env.

6. Chạy Ứng dụng
Sau khi hoàn tất các bước cài đặt và cấu hình, bạn có thể khởi động server backend bằng lệnh:

npm start

Theo dõi console để xem các log khởi tạo, kết nối cơ sở dữ liệu, và thông báo server đã chạy trên cổng nào (ví dụ: Server is running on port 5000 in development mode.).

7. Chèn Dữ liệu Mẫu (Seeding)
Dự án này có kịch bản để tự động chèn dữ liệu mẫu phong phú (bao gồm người dùng, danh mục quần áo, sản phẩm, đánh giá, và lịch sử đơn hàng) vào cả PostgreSQL và Neo4j, rất hữu ích cho việc phát triển và kiểm thử các tính năng, đặc biệt là hệ thống gợi ý.

Cách kích hoạt seeding:

Mở file .env của bạn.

Đặt các biến sau thành true:

NODE_ENV=development
SEED_DB=true
DB_FORCE_SYNC=true     # CẢNH BÁO: Sẽ XÓA và TẠO LẠI tất cả các bảng trong PostgreSQL!
NEO4J_FORCE_SEED=true  # CẢNH BÁO: Sẽ XÓA tất cả dữ liệu trong Neo4j!

Khởi động lại ứng dụng (npm start).

Quá trình seeding sẽ tự động chạy. Theo dõi log trong console để xem tiến trình.

QUAN TRỌNG: Sau khi seeding thành công và bạn đã kiểm tra xong, hãy đặt lại DB_FORCE_SYNC và NEO4J_FORCE_SEED về false trong file .env để tránh việc vô tình xóa mất dữ liệu trong các lần khởi động tiếp theo. SEED_DB=true có thể giữ nguyên nếu bạn muốn logic kiểm tra sự tồn tại của dữ liệu mẫu hoạt động (nó sẽ không seed lại nếu dữ liệu đã có và FORCE là false).

Dữ liệu mẫu được định nghĩa trong data/sampleData.js. Đảm bảo tất cả ID trong file này là các chuỗi UUID hợp lệ và cố định, không có tiền tố và không được tạo mới mỗi khi hàm getSampleData() được gọi. Đây là yếu tố then chốt để đảm bảo tính nhất quán ID giữa PostgreSQL và Neo4j.

Kịch bản seeding cho PostgreSQL nằm trong seeders/seedPostgres.js.

Kịch bản seeding và tạo constraints cho Neo4j nằm trong models/neo4j/schema.js.

8. Cấu trúc Thư mục Dự án
Dưới đây là cấu trúc thư mục dự kiến của dự án:

<project_root_name>/ # Ví dụ: Btl/
├── config/
│   ├── db.config.js         # Cấu hình kết nối PostgreSQL (Sequelize)
│   └── neo4j.config.js      # Cấu hình kết nối Neo4j driver (initialize, getSession, close)
├── controllers/
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   ├── recommendation.controller.js
│   └── user.controller.js     # Các chức năng quản lý người dùng bởi Admin
├── data/
│   └── sampleData.js        # Định nghĩa dữ liệu mẫu chi tiết với ID CỐ ĐỊNH và HỢP LỆ
├── middleware/
│   ├── auth.middleware.js   # Middleware verifyToken, isAdmin
│   └── errorHandler.js      # Middleware xử lý lỗi tập trung
├── models/
│   ├── User.js              # Model Sequelize cho User
│   ├── Product.js           # Model Sequelize cho Product
│   ├── Category.js          # ... và các model Sequelize khác ...
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Review.js
│   ├── index.js             # Khởi tạo Sequelize, nạp tất cả models, định nghĩa associations
│   └── neo4j/
│       ├── schema.js          # Tạo constraints và seed dữ liệu cho Neo4j
│       └── queries.js         # Chứa các hàm thực thi truy vấn Cypher cho recommendation
├── routes/
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── orderRoutes.js       # (Hoặc order.routes.js)
│   ├── productRoutes.js     # (Hoặc product.routes.js)
│   ├── recommendation.routes.js
│   └── userRoutes.js        # (Hoặc user.routes.js - cho admin)
├── seeders/
│   └── seedPostgres.js      # Kịch bản chèn dữ liệu mẫu cho PostgreSQL
├── .env                     # File biến môi trường (QUAN TRỌNG: KHÔNG commit lên Git)
├── .env.example             # File ví dụ cho biến môi trường (commit lên Git)
├── .gitignore               # Liệt kê các file/thư mục bỏ qua khi commit
├── app.js                   # File khởi tạo ứng dụng Express chính, đăng ký routes, middleware
├── package.json             # Thông tin dự án và danh sách dependencies
└── package-lock.json        # (Hoặc yarn.lock)

9. Tổng quan API Endpoints
Tất cả các API đều có tiền tố chung là /api. Để xem danh sách đầy đủ các endpoints, phương thức, request body, response mẫu và mã lỗi, vui lòng tham khảo tài liệu API Chi tiết cho Backend Web Bán Quần Áo (đã được cung cấp trong Canvas với ID api_documentation_v1).

Dưới đây là tóm tắt các nhóm API chính:

/api/auth: Xác thực người dùng, quản lý hồ sơ cá nhân (đăng ký, đăng nhập, đăng xuất, xem/cập nhật hồ sơ, đổi mật khẩu).

/api/users: Quản lý người dùng bởi Admin (xem danh sách, xem chi tiết, cập nhật thông tin, vô hiệu hóa).

/api/categories: Quản lý danh mục sản phẩm (CRUD bởi Admin, xem danh mục và sản phẩm theo danh mục bởi User).

/api/products: Quản lý sản phẩm (CRUD bởi Admin, xem sản phẩm và tạo đánh giá bởi User). Hỗ trợ lọc, sắp xếp, phân trang.

/api/cart: Quản lý giỏ hàng của người dùng đã đăng nhập (xem, thêm, cập nhật, xóa sản phẩm).

/api/orders: Quản lý đơn hàng (tạo đơn bởi User, xem lịch sử đơn hàng, xem chi tiết đơn, quản lý và cập nhật trạng thái đơn bởi Admin).

/api/reviews: Quản lý đánh giá bởi Admin (xem, cập nhật trạng thái, xóa).

/api/recommendations: Cung cấp các gợi ý sản phẩm từ Neo4j (gợi ý cá nhân hóa, sản phẩm tương tự, sản phẩm thường mua cùng, phân tích thói quen mua hàng).

10. Các Chức năng Chính Chi tiết
Xác thực & Phân quyền Người dùng: Sử dụng JWT, mật khẩu hash an toàn (bcryptjs), phân quyền rõ ràng giữa vai trò user và admin thông qua middleware.

Quản lý Sản phẩm & Danh mục Toàn diện: CRUD đầy đủ cho sản phẩm và danh mục bởi admin. Hỗ trợ danh mục đa cấp (cha-con). Áp dụng "Soft delete" (vô hiệu hóa thay vì xóa hẳn) cho sản phẩm và danh mục để bảo toàn dữ liệu. Hiển thị sản phẩm theo danh mục, hỗ trợ các chức năng lọc, sắp xếp, và phân trang nâng cao.

Quy trình Đặt hàng Hoàn chỉnh: Người dùng có thể tạo đơn hàng từ các sản phẩm. Hệ thống sử dụng transactions của Sequelize để đảm bảo tính toàn vẹn dữ liệu khi tạo đơn hàng và cập nhật số lượng tồn kho. Admin có thể quản lý và cập nhật trạng thái các đơn hàng.

Đánh giá Sản phẩm: Người dùng đã đăng nhập có thể viết đánh giá (rating và comment) cho sản phẩm. Admin có thể duyệt và quản lý các đánh giá. Hệ thống tự động tính toán averageRating và numReviews cho sản phẩm sau mỗi lượt đánh giá.

Hệ thống Gợi ý Sản phẩm Thông minh (Neo4j): Tận dụng cơ sở dữ liệu đồ thị Neo4j để phân tích các mối quan hệ phức tạp và hành vi người dùng. Cung cấp các loại gợi ý đa dạng: gợi ý cá nhân hóa dựa trên lịch sử mua hàng, gợi ý sản phẩm tương tự về danh mục và giá, gợi ý các sản phẩm thường được mua cùng nhau. Phân tích thói quen mua hàng của người dùng theo danh mục.

Quản lý Giỏ hàng: API cho phép người dùng thêm sản phẩm vào giỏ, xem nội dung giỏ hàng, cập nhật số lượng sản phẩm, và xóa sản phẩm khỏi giỏ hoặc xóa toàn bộ giỏ hàng.

Seeding Dữ liệu Mẫu Nâng cao: Kịch bản tự động chèn dữ liệu mẫu phong phú và nhất quán (đặc biệt về ID) cho cả PostgreSQL và Neo4j. Dữ liệu mẫu bao gồm cả việc tạo ra các hành vi mua hàng để hệ thống gợi ý có thể hoạt động và trả về kết quả ngay khi khởi động ở chế độ development.

Xử lý Lỗi Tập trung: Middleware errorHandler tùy chỉnh để bắt và trả về các thông báo lỗi một cách nhất quán, dễ hiểu cho client, đồng thời ghi log chi tiết ở server trong môi trường development.

11. Hướng dẫn Gỡ lỗi (Troubleshooting)
Lỗi Kết nối CSDL:

Kiểm tra kỹ các biến DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD trong file .env cho PostgreSQL.

Kiểm tra NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE cho Neo4j.

Đảm bảo cả hai server CSDL đang chạy và có thể truy cập được từ ứng dụng.

Lỗi Seeding:

Đảm bảo các biến SEED_DB, DB_FORCE_SYNC, NEO4J_FORCE_SEED được đặt đúng trong .env khi bạn muốn thực hiện seeding.

Lỗi "invalid input syntax for type uuid": Nguyên nhân chính là ID trong file data/sampleData.js không phải là UUID hợp lệ (ví dụ: có tiền tố như p1, c1). Hãy đảm bảo tất cả ID được định nghĩa là các chuỗi UUID đúng chuẩn, không có tiền tố.

ID không nhất quán giữa PostgreSQL và Neo4j:

QUAN TRỌNG NHẤT: Đảm bảo file data/sampleData.js định nghĩa các ID (cho users, categories, products, reviews, orders, orderItems) một cách CỐ ĐỊNH. Các ID này không được tạo mới (uuidv4()) mỗi khi hàm getSampleData() được gọi. Hãy hardcode các chuỗi UUID hợp lệ này.

Đảm bảo cả seeders/seedPostgres.js và models/neo4j/schema.js đều gọi getSampleData() một lần duy nhất ở đầu hàm seeding của chúng và sử dụng bộ dữ liệu đó trong suốt quá trình.

Chạy lại seeding với DB_FORCE_SYNC=true và NEO4J_FORCE_SEED=true sau khi đã sửa data/sampleData.js.

Kiểm tra log output từ seedPostgres.js (đặc biệt là phần "Verifying product IDs") để xem ID có khớp không.

Xem console log của server để biết thông tin chi tiết về lỗi seeding.

Lỗi API "Not Found" hoặc "Unauthorized":

Kiểm tra xem bạn đã gửi đúng Authorization header với Bearer token hợp lệ chưa (cho các route yêu cầu xác thực).

Kiểm tra xem token còn hạn không.

Kiểm tra xem user có đủ quyền (ví dụ: isAdmin) cho route đó không.

Đảm bảo ID bạn truyền vào (ví dụ: productId, orderId) là chính xác và tồn tại trong CSDL với trạng thái isActive: true (nếu có áp dụng).

Lỗi "Cannot read properties of undefined (reading 'run')" trong models/neo4j/queries.js:

Đảm bảo config/neo4j.config.js export một hàm getSession() trả về một session mới (driver.session()) mỗi khi được gọi, và driver đã được khởi tạo.

Đảm bảo mỗi hàm trong models/neo4j/queries.js gọi getSession() ở đầu và await session.close() trong khối finally.

Xem Log: Luôn kiểm tra console log của server backend để biết thông tin chi tiết về lỗi.

12. Đóng góp (Tùy chọn)
Nếu bạn muốn đóng góp cho dự án, vui lòng tuân theo các hướng dẫn sau:

Fork repository.

Tạo một nhánh mới cho tính năng của bạn (git checkout -b feature/TenTinhNangMoi).

Thực hiện các thay đổi và commit (git commit -m 'Add: TenTinhNangMoi').

Push lên nhánh đó (git push origin feature/TenTinhNangMoi).

Mở một Pull Request trên GitHub.

13. Giấy phép (Tùy chọn)
Dự án này được cấp phép dưới Giấy phép MIT (hoặc giấy phép bạn chọn). Xem file LICENSE (nếu có) để biết thêm chi tiết.