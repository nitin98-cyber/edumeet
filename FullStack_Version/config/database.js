// ========================================
// Database Configuration
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool with error handling
let pool;

try {
    pool = mysql.createPool({
        host: process.env.MYSQLHOST || process.env.DB_HOST,
        user: process.env.MYSQLUSER || process.env.DB_USER,
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
        database: process.env.MYSQLDATABASE || process.env.DB_NAME,
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });

    // Test connection in background (don't block)
    setTimeout(() => {
        pool.getConnection()
            .then(connection => {
                console.log('✅ Database connected successfully');
                connection.release();
            })
            .catch(err => {
                console.error('⚠️  Database connection warning:', err.message);
                console.log('Server will continue running. Use /setup.html to initialize database.');
            });
    }, 1000);
} catch (err) {
    console.error('⚠️  Database pool creation warning:', err.message);
    // Create a dummy pool that won't crash
    pool = {
        query: () => Promise.reject(new Error('Database not configured')),
        getConnection: () => Promise.reject(new Error('Database not configured'))
    };
}

module.exports = pool;
