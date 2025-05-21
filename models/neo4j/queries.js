// models/neo4j/queries.js
const { getSession } = require('../../config/neo4j.config');

// User-based recommendations
const getUserRecommendations = async (userId) => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})-[:PURCHASED]->(p1:Product)
            WHERE p1.isActive = true // Chỉ xét sản phẩm đã mua đang active
            MATCH (p1)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
            WHERE p1 <> p2 AND p2.isActive = true // <<< THÊM: Chỉ gợi ý sản phẩm active
            AND NOT EXISTS((u)-[:PURCHASED]->(p2)) 
            AND c.isActive = true // Đảm bảo category cũng active
            WITH p2, COUNT(DISTINCT c) as commonCategories // Hoặc một logic tính điểm khác
            ORDER BY commonCategories DESC
            LIMIT 10
            RETURN p2.id as productId, p2.title as title, p2.price as price, commonCategories AS score
            `, // Đổi tên commonPurchases thành score hoặc logic phù hợp hơn
            { userId }
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting user recommendations from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
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
            MATCH (p1:Product {id: $productId})
            WHERE p1.isActive = true // Đảm bảo sản phẩm gốc active
            MATCH (p1)-[:BELONGS_TO]->(c:Category)
            WHERE c.isActive = true // Đảm bảo category active
            MATCH (p2:Product)-[:BELONGS_TO]->(c)
            WHERE p1 <> p2 AND p2.isActive = true // <<< THÊM: Chỉ gợi ý sản phẩm active
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
        }
    }
};

// Category hierarchy - Chỉ lấy category active
const getCategoryHierarchy = async () => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (c:Category)
            WHERE c.isActive = true // <<< THÊM: Chỉ lấy category active
            OPTIONAL MATCH (c)-[:IS_CHILD_OF]->(parent:Category)
            WHERE parent.isActive = true // Đảm bảo parent cũng active nếu có
            RETURN c.id as id, c.name as category, parent.id as parentId, parent.name as parentName
            `
        );
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Error getting category hierarchy from Neo4j:', error);
        return [];
    } finally {
        if (session) {
            await session.close();
        }
    }
};

// Purchase patterns - Phân tích dựa trên sản phẩm đã mua (có thể active hoặc không)
// nhưng kết quả trả về là category, nên đảm bảo category đó active
const getPurchasePatterns = async (userId) => {
    let session;
    try {
        session = getSession();
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)
            MATCH (p)-[:BELONGS_TO]->(c:Category)
            WHERE c.isActive = true // <<< THÊM: Chỉ xem xét category active
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
            MATCH (p1:Product {id: $productId})
            WHERE p1.isActive = true // Đảm bảo sản phẩm gốc active
            MATCH (p1)<-[:PURCHASED]-(u:User)-[:PURCHASED]->(p2:Product)
            WHERE p1 <> p2 AND p2.isActive = true // <<< THÊM: Chỉ gợi ý sản phẩm active
            WITH p2, COUNT(DISTINCT u) as coPurchaseCount
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
        }
    }
};

// Create purchase relationship - không cần thay đổi vì nó ghi nhận hành vi
const createPurchaseRelationship = async (userId, productId) => {
    let session;
    try {
        session = getSession();
        // Kiểm tra xem product có active không trước khi tạo mối quan hệ PURCHASED có thể là một ý hay
        // Tuy nhiên, việc mua một sản phẩm đã từng active nhưng giờ không còn active nữa vẫn có thể xảy ra.
        // Tùy thuộc vào logic kinh doanh của bạn.
        // Ở đây, chúng ta giả định vẫn ghi nhận việc mua.
        await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (p:Product {id: $productId}) // Không kiểm tra p.isActive ở đây để vẫn ghi nhận được việc mua sản phẩm có thể đã bị deactive
            MERGE (u)-[r:PURCHASED]->(p)
            ON CREATE SET r.timestamp = datetime(), r.count = 1, r.quantity = $quantity, r.priceAtPurchase = $priceAtPurchase, r.orderId = $orderId
            ON MATCH SET r.lastPurchased = datetime(), r.count = COALESCE(r.count, 0) + 1 // Hoặc logic cập nhật phức tạp hơn
            `,
            // Cần truyền thêm quantity, priceAtPurchase, orderId nếu có từ controller
            { userId, productId, quantity: 1, priceAtPurchase: null, orderId: null } // Giá trị mặc định nếu không truyền
        );
        return true;
    } catch (error) {
        console.error('Error creating purchase relationship in Neo4j:', error);
        return false;
    } finally {
        if (session) {
            await session.close();
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
