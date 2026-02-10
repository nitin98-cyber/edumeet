// Automatic Database Initialization for Railway
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
    let connection;
    
    try {
        console.log('🔍 Checking database connection...');
        
        // Connect to database
        connection = await mysql.createConnection({
            host: process.env.MYSQLHOST || process.env.DB_HOST,
            user: process.env.MYSQLUSER || process.env.DB_USER,
            password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
            database: process.env.MYSQLDATABASE || process.env.DB_NAME,
            port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
        });

        console.log('✓ Connected to database');

        // Check if tables exist
        const [tables] = await connection.query('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('📦 Database is empty. Importing schema...');
            
            // Create tables with correct schema
            await connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS students (
                    student_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    roll_number VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                )
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS faculty (
                    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    department VARCHAR(100),
                    email VARCHAR(100) NOT NULL,
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                )
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
                    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
                )
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS appointments (
                    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                    student_id INT NOT NULL,
                    slot_id INT NOT NULL,
                    purpose TEXT,
                    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
                )
            `);

            // Insert sample users with proper bcrypt hashing
            console.log('👤 Creating users...');
            const adminPassword = await bcrypt.hash('admin123', 10);
            const facultyPassword = await bcrypt.hash('faculty123', 10);
            const studentPassword = await bcrypt.hash('student123', 10);

            await connection.query(`
                INSERT INTO users (email, password, user_type) VALUES
                ('admin@edumeet.com', ?, 'admin'),
                ('faculty@edumeet.com', ?, 'faculty'),
                ('student@edumeet.com', ?, 'student')
            `, [adminPassword, facultyPassword, studentPassword]);

            // Get user IDs
            const [adminUser] = await connection.query("SELECT user_id FROM users WHERE email = 'admin@edumeet.com'");
            const [facultyUser] = await connection.query("SELECT user_id FROM users WHERE email = 'faculty@edumeet.com'");
            const [studentUser] = await connection.query("SELECT user_id FROM users WHERE email = 'student@edumeet.com'");

            // Insert faculty
            await connection.query(`
                INSERT INTO faculty (user_id, name, department, email, phone)
                VALUES (?, 'Dr. John Smith', 'Computer Science', 'faculty@edumeet.com', '1234567890')
            `, [facultyUser[0].user_id]);

            // Insert student
            await connection.query(`
                INSERT INTO students (user_id, name, roll_number, email, phone)
                VALUES (?, 'Alice Johnson', 'CS2024001', 'student@edumeet.com', '0987654321')
            `, [studentUser[0].user_id]);
            
            console.log('✓ Database schema imported successfully!');
            console.log('✓ Sample users created:');
            console.log('   Admin: admin@edumeet.com / admin123');
            console.log('   Faculty: faculty@edumeet.com / faculty123');
            console.log('   Student: student@edumeet.com / student123');
        } else {
            console.log(`✓ Database already initialized (${tables.length} tables found)`);
            
            // Check if users exist
            try {
                const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
                if (users[0].count === 0) {
                    console.log('⚠️  Tables exist but no users found. Creating users...');
                    
                    const adminPassword = await bcrypt.hash('admin123', 10);
                    const facultyPassword = await bcrypt.hash('faculty123', 10);
                    const studentPassword = await bcrypt.hash('student123', 10);

                    await connection.query(`
                        INSERT INTO users (email, password, user_type) VALUES
                        ('admin@edumeet.com', ?, 'admin'),
                        ('faculty@edumeet.com', ?, 'faculty'),
                        ('student@edumeet.com', ?, 'student')
                    `, [adminPassword, facultyPassword, studentPassword]);

                    const [adminUser] = await connection.query("SELECT user_id FROM users WHERE email = 'admin@edumeet.com'");
                    const [facultyUser] = await connection.query("SELECT user_id FROM users WHERE email = 'faculty@edumeet.com'");
                    const [studentUser] = await connection.query("SELECT user_id FROM users WHERE email = 'student@edumeet.com'");

                    await connection.query(`
                        INSERT INTO faculty (user_id, name, department, email, phone)
                        VALUES (?, 'Dr. John Smith', 'Computer Science', 'faculty@edumeet.com', '1234567890')
                    `, [facultyUser[0].user_id]);

                    await connection.query(`
                        INSERT INTO students (user_id, name, roll_number, email, phone)
                        VALUES (?, 'Alice Johnson', 'CS2024001', 'student@edumeet.com', '0987654321')
                    `, [studentUser[0].user_id]);
                    
                    console.log('✓ Users created successfully!');
                } else {
                    console.log(`✓ Users already exist (${users[0].count} users)`);
                }
            } catch (err) {
                console.log('⚠️  Could not check users:', err.message);
            }
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
