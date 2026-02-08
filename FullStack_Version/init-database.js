// Automatic Database Initialization for Railway
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    let connection;
    
    try {
        console.log('🔍 Checking database connection...');
        
        // Connect to database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('✓ Connected to database');

        // Check if tables exist
        const [tables] = await connection.query('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('📦 Database is empty. Importing schema...');
            
            // Read and execute SQL file
            const sqlPath = path.join(__dirname, '..', 'Database', 'edumeet_database.sql');
            const sql = fs.readFileSync(sqlPath, 'utf8');
            
            // Split by semicolon and execute each statement
            const statements = sql.split(';').filter(stmt => stmt.trim());
            
            for (const statement of statements) {
                if (statement.trim()) {
                    await connection.query(statement);
                }
            }
            
            console.log('✓ Database schema imported successfully!');
            console.log('✓ Sample users created:');
            console.log('   Admin: admin@edumeet.com / admin123');
            console.log('   Faculty: faculty@edumeet.com / faculty123');
            console.log('   Student: student@edumeet.com / student123');
        } else {
            console.log(`✓ Database already initialized (${tables.length} tables found)`);
        }
        
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = initializeDatabase;

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('✓ Database initialization complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Failed to initialize database:', error);
            process.exit(1);
        });
}
