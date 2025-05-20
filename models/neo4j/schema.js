// models/neo4j/schema.js
// Giả sử file neo4j.config.js nằm ở thư mục config ở gốc dự án
// Đường dẫn ../../config/neo4j.config là tương đối từ models/neo4j/
const { getSession, closeDriver } = require('../../config/neo4j.config'); 
// Giả sử file sampleData.js nằm ở thư mục data ở gốc dự án
// Đường dẫn ../../data/sampleData.js là tương đối từ models/neo4j/
const getSampleData = require('../../data/sampleData'); 

const createConstraints = async () => {
    const session = getSession(); // Lấy session từ driver đã được khởi tạo
    try {
        await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
        await session.run('CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE');
        await session.run('CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE');
        await session.run('CREATE INDEX product_title IF NOT EXISTS FOR (p:Product) ON (p.title)');
        // await session.run('CREATE INDEX product_category_name IF NOT EXISTS FOR (p:Product) ON (p.categoryName)'); 
        await session.run('CREATE CONSTRAINT category_id IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE');
        await session.run('CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE');
        console.log('Neo4j constraints checked/created successfully.');
    } catch (error) {
        console.error('Error creating/checking Neo4j constraints:', error);
        throw error; // Ném lỗi để app.js có thể bắt nếu cần
    } finally {
        if (session) {
            await session.close(); // Luôn đóng session sau khi sử dụng
        }
    }
};

const seedNeo4jDatabase = async (force = false) => {
    const session = getSession();
    try {
        if (force) {
            console.log('Forcing data wipe for Neo4j...');
            await session.run('MATCH (n) DETACH DELETE n');
            console.log('Neo4j database wiped.');
        } else {
            // Kiểm tra admin user (hoặc một node bất kỳ) để xem có cần seed không
            const result = await session.run('MATCH (u:User {id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"}) RETURN u.id AS id');
            if (result.records.length > 0) {
                console.log('Admin user already exists in Neo4j. Skipping Neo4j data seeding.');
                return;
            }
            console.log('No admin user found in Neo4j, proceeding with Neo4j data seeding...');
        }

        const { users, categories, products: sampleProductsArray } = await getSampleData();

        console.log('Seeding Users for Neo4j...');
        for (const user of users) {
            // Chỉ lưu các trường cần thiết cho Neo4j, không lưu password đã hash
            await session.run(
                'MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email, u.role = $role',
                { id: user.id, name: user.name, email: user.email, role: user.role }
            );
        }
        console.log('Neo4j Users seeded.');

        console.log('Seeding Categories for Neo4j...');
        for (const category of categories) {
            await session.run(
                'MERGE (c:Category {id: $id}) SET c.name = $name, c.description = $description, c.image = $image',
                { id: category.id, name: category.name, description: category.description, image: category.image }
            );
            if (category.parentId) {
                await session.run(
                    `MATCH (child:Category {id: $childId})
                     MATCH (parent:Category {id: $parentId})
                     MERGE (child)-[:IS_CHILD_OF]->(parent)`,
                    { childId: category.id, parentId: category.parentId }
                );
            }
        }
        console.log('Neo4j Categories seeded.');

        console.log('Seeding Products for Neo4j...');
        for (const product of sampleProductsArray) {
            await session.run(
                `MERGE (p:Product {id: $id})
                 SET p.title = $title, p.name = $name, p.price = $price, p.image = $image, p.description = $description
                 WITH p
                 MATCH (c:Category {id: $categoryId})
                 MERGE (p)-[:BELONGS_TO]->(c)`,
                { 
                    id: product.id, 
                    title: product.title,
                    name: product.name, 
                    price: product.price,
                    image: product.image,
                    description: product.description, // Thêm description nếu cần cho Neo4j
                    categoryId: product.categoryId 
                }
            );
        }
        console.log('Neo4j Products seeded.');
        
        // --- SEED PURCHASE RELATIONSHIPS (Ví dụ) ---
        const createdUsers = users; 
        const createdProducts = sampleProductsArray;

        if (createdUsers.length >= 2 && createdProducts.length >=3) { // Đảm bảo đủ user và product để tạo mối quan hệ
            console.log('Seeding PURCHASED relationships for Neo4j...');
            // Alice (users[1]) mua Laptop Pro Max (products[0]) và Smartphone X100 (products[2])
            await session.run(
                `MATCH (u:User {id: $userId}), (p:Product {id: $productId})
                 MERGE (u)-[r:PURCHASED {timestamp: datetime()}]->(p)`,
                { userId: createdUsers[1].id, productId: createdProducts[0].id }
            );
            await session.run(
                `MATCH (u:User {id: $userId}), (p:Product {id: $productId})
                 MERGE (u)-[r:PURCHASED {timestamp: datetime()}]->(p)`,
                { userId: createdUsers[1].id, productId: createdProducts[2].id }
            );

            // Bob (users[2]) mua Laptop Ultra Slim (products[1])
            await session.run(
                `MATCH (u:User {id: $userId}), (p:Product {id: $productId})
                 MERGE (u)-[r:PURCHASED {timestamp: datetime()}]->(p)`,
                { userId: createdUsers[2].id, productId: createdProducts[1].id }
            );
            console.log('Neo4j PURCHASED relationships seeded.');
        } else {
             console.warn('Not enough users or products in sample data to create purchase relationships for Neo4j.');
        }
        
        console.log('Neo4j database seeding completed successfully.');

    } catch (error) {
        console.error('Error seeding Neo4j database:', error);
        throw error; // Ném lỗi để app.js có thể bắt nếu cần
    } finally {
        if (session) {
            await session.close(); // Luôn đóng session
        }
    }
};

// Hàm này được gọi từ app.js
const initializeAndSeedNeo4j = async (forceSeed = false) => {
    try {
        await createConstraints(); // Luôn kiểm tra/tạo constraints
        await seedNeo4jDatabase(forceSeed); // Seed dữ liệu
    } catch (error) {
        console.error("Failed to initialize and seed Neo4j:", error);
        // Không ném lỗi ở đây nữa vì đã ném ở các hàm con, app.js sẽ bắt
    }
    // Không gọi closeDriver() ở đây vì driver được quản lý bởi app.js
};

module.exports = {
    initializeAndSeedNeo4j
};
