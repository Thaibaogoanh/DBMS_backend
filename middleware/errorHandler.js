const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error.message = message;
        res.status(400).json({
            success: false,
            error: message
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = Object.values(err.errors).map(val => val.message);
        error.message = message;
        res.status(400).json({
            success: false,
            error: message
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        res.status(401).json({
            success: false,
            error: error.message
        });
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        res.status(401).json({
            success: false,
            error: error.message
        });
    }

    // Default error
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler; 