// ========================================
// Update Database with New Features
// ========================================

const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function updateDatabase() {
    let connection;
    
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'edumeet',
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Read SQL file
        const sql = fs.readFileSync('./add_new_features.sql', 'utf8');

        // Execute SQL
        await connection.query(sql);

        console.log('✅ Database updated successfully!');
        console.log('\n📋 New Features Added:');
        console.log('   1. ⭐ Rating System');
        console.log('   2. ❤️  Favorite Faculty');
        console.log('   3. 🔍 Advanced Search (department, expertise)');
        console.log('   4. 📝 Appointment Notes');
        console.log('\n🎉 All features are ready to use!');

    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateDatabase();
