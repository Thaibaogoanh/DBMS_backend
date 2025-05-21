// models/neo4j/schema.js
const { getSession } = require('../../config/neo4j.config'); 
const getSampleData = require('../../data/sampleData'); 

const createConstraints = async () => {
    let session; 
    try {
        session = getSession(); 
        console.log('Neo4j: Executing constraints checks...');
        await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
        await session.run('CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE');
        await session.run('CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE');
        await session.run('CREATE INDEX product_title_neo4j IF NOT EXISTS FOR (p:Product) ON (p.title)');
        await session.run('CREATE CONSTRAINT category_id IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE');
        await session.run('CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE');
        console.log('Neo4j: Constraints checked/created successfully.');
    } catch (error) {
        console.error('Neo4j: Error creating/checking constraints:', error);
        throw error; 
    } finally {
        if (session) {
            await session.close(); 
        }
    }
};

const seedNeo4jDatabase = async (force = false) => {
    let session; 
    try {
        session = getSession(); 
        console.log('Neo4j: Starting database seeding...');
        if (force) {
            console.log('Neo4j: Forcing data wipe...');
            await session.run('MATCH (n) DETACH DELETE n');
            console.log('Neo4j: Database wiped.');
        } else {
            const adminUserEmail = 'admin@example.com'; 
            const result = await session.run('MATCH (u:User {email: $email}) RETURN u.id AS id', { email: adminUserEmail });
            if (result.records.length > 0) {
                console.log(`Neo4j: User with email '${adminUserEmail}' already exists. Skipping data seeding to avoid conflicts.`);
                if (session) await session.close(); 
                return;
            }
            console.log(`Neo4j: No user found with email '${adminUserEmail}', proceeding with data seeding...`);
        }

        const { users, categories, products, orders, orderItems } = await getSampleData();

        console.log('Neo4j: Seeding Users...');
        for (const user of users) {
            await session.run(
                'MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email, u.role = $role, u.image = $image, u.address = $address',
                { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image, address: user.address }
            );
        }
        console.log('Neo4j: Users seeded.');

        console.log('Neo4j: Seeding Categories...');
        for (const category of categories) {
            await session.run(
                'MERGE (c:Category {id: $id}) SET c.name = $name, c.description = $description, c.image = $image, c.isActive = $isActive', // Thêm isActive
                { id: category.id, name: category.name, description: category.description, image: category.image, isActive: category.isActive !== undefined ? category.isActive : true } // Mặc định là true nếu không có
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
        console.log('Neo4j: Categories seeded.');

        console.log('Neo4j: Seeding Products...');
        for (const product of products) {
            await session.run(
                `MERGE (p:Product {id: $id})
                 SET p.title = $title, p.name = $name, p.price = $price, p.image = $image, 
                     p.description = $description, p.stock = $stock, 
                     p.averageRating = $averageRating, p.numReviews = $numReviews,
                     p.isNew = $isNew, p.isFeatured = $isFeatured,
                     p.isActive = $isActive  // <<< THÊM DÒNG NÀY
                 WITH p
                 MATCH (c:Category {id: $categoryId})
                 MERGE (p)-[:BELONGS_TO]->(c)`,
                { 
                    id: product.id, 
                    title: product.title,
                    name: product.name, 
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    stock: product.stock,
                    averageRating: product.averageRating === undefined ? 0 : product.averageRating, // Đảm bảo có giá trị mặc định
                    numReviews: product.numReviews === undefined ? 0 : product.numReviews, // Đảm bảo có giá trị mặc định
                    isNew: product.isNew === undefined ? false : product.isNew, // Đảm bảo có giá trị mặc định
                    isFeatured: product.isFeatured === undefined ? false : product.isFeatured, // Đảm bảo có giá trị mặc định
                    categoryId: product.categoryId,
                    isActive: product.isActive !== undefined ? product.isActive : true // <<< THÊM THAM SỐ NÀY, mặc định là true nếu không có trong sampleData
                }
            );
        }
        console.log('Neo4j: Products seeded.');
        
        console.log('Neo4j: Seeding PURCHASED relationships based on sample orders...');
        for (const order of orders) {
            const orderUser = users.find(u => u.id === order.userId);
            if (!orderUser) {
                console.warn(`Neo4j Seeding: User with ID ${order.userId} for order ${order.id} not found.`);
                continue;
            }

            const itemsInThisOrder = orderItems.filter(oi => oi.orderId === order.id);
            for (const item of itemsInThisOrder) {
                const product = products.find(p => p.id === item.productId);
                if (!product) {
                    console.warn(`Neo4j Seeding: Product with ID ${item.productId} in order ${order.id} not found.`);
                    continue;
                }
                
                await session.run(
                    `MATCH (u:User {id: $userId}), (p:Product {id: $productId})
                     MERGE (u)-[r:PURCHASED]->(p)
                     ON CREATE SET r.timestamp = datetime($orderCreatedAt), r.quantity = $quantity, r.priceAtPurchase = $price, r.orderId = $orderId, r.count = 1
                     ON MATCH SET r.lastPurchased = datetime($orderCreatedAt), r.count = COALESCE(r.count, 0) + $quantity 
                    `, 
                    { 
                        userId: orderUser.id, 
                        productId: product.id,
                        quantity: item.quantity,
                        price: item.price, 
                        orderId: order.id,
                        orderCreatedAt: order.createdAt ? new Date(order.createdAt).toISOString() : datetime().toString() 
                    }
                );
            }
        }
        console.log('Neo4j: PURCHASED relationships seeded.');
        
        console.log('Neo4j: Database seeding completed successfully.');

    } catch (error) {
        console.error('Neo4j: Error seeding database:', error);
        throw error; 
    } finally {
        if (session) {
            await session.close(); 
        }
    }
};

const initializeAndSeedNeo4j = async (forceSeed = false) => {
    try {
        await createConstraints(); 
        await seedNeo4jDatabase(forceSeed); 
    } catch (error) {
        console.error("Neo4j: Failed to initialize and seed:", error.message);
    }
};

module.exports = {
    initializeAndSeedNeo4j
};
