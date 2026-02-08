// Railway Database Import Script
// Run this after deployment is successful

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDatabase() {
    try {
        console.log('Connecting to Railway MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            multipleStatements: true
        });

        console.log('Connected successfully!');

        // Read SQL file
        const sqlPath = path.join(__dirname, '..', 'Database', 'edumeet_database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Importing database schema...');
        await connection.query(sql);

        console.log('✓ Database schema imported successfully!');
        
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error importing database:', error);
        process.exit(1);
    }
}

importDatabase();
