// models/neo4j/queries.js
// Thay vì import trực tiếp session, chúng ta import hàm getSession
const { getSession } = require('../../config/neo4j.config'); // Đảm bảo đường dẫn này đúng

// User-based recommendations
const getUserRecommendations = async (userId) => {
    let session; // Khai báo session ở scope của hàm
    try {
        session = getSession(); // Lấy một session mới
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})-[:PURCHASED]->(p1:Product)
            MATCH (p1)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
            WHERE p1 <> p2
            AND NOT EXISTS((u)-[:PURCHASED]->(p2))
            WITH p2, COUNT(*) as commonPurchases
            ORDER BY commonPurchases DESC
            LIMIT 10
            RETURN p2.id as productId, p2.title as title, p2.price as price, commonPurchases
            `,
            { userId }
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting user recommendations from Neo4j:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    } finally {
        if (session) {
            await session.close(); // Luôn đóng session
            // console.log('Neo4j session for getUserRecommendations closed.');
        }
    }
};

// Similar products based on category and price range
const getSimilarProducts = async (productId) => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (p1:Product {id: $productId})-[:BELONGS_TO]->(c:Category)
            MATCH (p2:Product)-[:BELONGS_TO]->(c)
            WHERE p1 <> p2
            AND p2.price >= p1.price * 0.8 
            AND p2.price <= p1.price * 1.2 
            RETURN p2.id as productId, p2.title as title, p2.price as price,
                   abs(p2.price - p1.price) as priceDifference
            ORDER BY priceDifference
            LIMIT 5
            `,
            { productId }
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting similar products from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
            // console.log('Neo4j session for getSimilarProducts closed.');
        }
    }
};

// Category hierarchy
const getCategoryHierarchy = async () => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (c:Category)
            OPTIONAL MATCH (c)-[:IS_CHILD_OF]->(parent:Category) // Giả sử mối quan hệ là IS_CHILD_OF từ con đến cha
            RETURN c.id as id, c.name as category, parent.id as parentId, parent.name as parentName
            `
            // Hoặc nếu bạn muốn danh sách con:
            // MATCH (c:Category)
            // OPTIONAL MATCH (c)<-[:IS_CHILD_OF]-(sub:Category)
            // RETURN c.name as category, collect(sub.name) as subcategories
        );
        // Xử lý kết quả tùy theo cấu trúc bạn muốn trả về
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting category hierarchy from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
            // console.log('Neo4j session for getCategoryHierarchy closed.');
        }
    }
};

// Purchase patterns
const getPurchasePatterns = async (userId) => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)
            MATCH (p)-[:BELONGS_TO]->(c:Category)
            WITH c, COUNT(*) as purchaseCount
            ORDER BY purchaseCount DESC
            RETURN c.name as category, purchaseCount
            `,
            { userId }
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting purchase patterns from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
            // console.log('Neo4j session for getPurchasePatterns closed.');
        }
    }
};

// Frequently bought together
const getFrequentlyBoughtTogether = async (productId) => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (p1:Product {id: $productId})<-[:PURCHASED]-(u:User)-[:PURCHASED]->(p2:Product)
            WHERE p1 <> p2
            WITH p2, COUNT(DISTINCT u) as coPurchaseCount // Đếm số user duy nhất mua cùng
            ORDER BY coPurchaseCount DESC
            LIMIT 5
            RETURN p2.id as productId, p2.title as title, p2.price as price, coPurchaseCount
            `,
            { productId }
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting frequently bought together from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
            // console.log('Neo4j session for getFrequentlyBoughtTogether closed.');
        }
    }
};

// Create purchase relationship
const createPurchaseRelationship = async (userId, productId) => {
    let session;
    try {
        session = getSession();
        await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (p:Product {id: $productId})
            MERGE (u)-[r:PURCHASED]->(p)
            ON CREATE SET r.timestamp = datetime(), r.count = 1
            ON MATCH SET r.count = COALESCE(r.count, 0) + 1, r.lastPurchased = datetime()
            `, // Thêm logic đếm số lần mua hoặc cập nhật timestamp
            { userId, productId }
        );
        return true;
    } catch (error) {
        console.error('Error creating purchase relationship in Neo4j:', error);
        return false;
    } finally {
        if (session) {
            await session.close();
            // console.log('Neo4j session for createPurchaseRelationship closed.');
        }
    }
};

module.exports = {
    getUserRecommendations,
    getSimilarProducts,
    getCategoryHierarchy,
    getPurchasePatterns,
    getFrequentlyBoughtTogether,
    createPurchaseRelationship
};
