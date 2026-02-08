// Automatic Database Initialization for Railway
const mysql = require('mysql2/promise');

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
            
            // Create tables directly (inline SQL)
            await connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('student', 'faculty', 'admin') NOT NULL,
                    department VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS time_slots (
                    slot_id INT AUTO_INCREMENT PRIMARY KEY,
                    faculty_id INT NOT NULL,
                    date DATE NOT NULL,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    is_available BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (faculty_id) REFERENCES users(user_id) ON DELETE CASCADE
                );
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS appointments (
                    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                    student_id INT NOT NULL,
                    slot_id INT NOT NULL,
                    purpose TEXT,
                    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
                );
            `);

            // Insert sample users
            await connection.query(`
                INSERT IGNORE INTO users (name, email, password, role, department) VALUES
                ('Admin User', 'admin@edumeet.com', '$2b$10$rZ5vK8jxqX9YxqZ5vK8jxO7Z5vK8jxqX9YxqZ5vK8jxqX9YxqZ5vK', 'admin', 'Administration'),
                ('Dr. John Faculty', 'faculty@edumeet.com', '$2b$10$rZ5vK8jxqX9YxqZ5vK8jxO7Z5vK8jxqX9YxqZ5vK8jxqX9YxqZ5vK', 'faculty', 'Computer Science'),
                ('Student User', 'student@edumeet.com', '$2b$10$rZ5vK8jxqX9YxqZ5vK8jxO7Z5vK8jxqX9YxqZ5vK8jxqX9YxqZ5vK', 'student', 'Computer Science');
            `);
            
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
