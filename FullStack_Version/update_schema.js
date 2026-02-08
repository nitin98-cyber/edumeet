// ========================================
// Update Database Schema
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');

        // Check if columns already exist
        const [studentCols] = await connection.query(
            "SHOW COLUMNS FROM students LIKE 'section'"
        );

        if (studentCols.length === 0) {
            console.log('📝 Adding section and course columns to students table...');
            await connection.query(`
                ALTER TABLE students 
                ADD COLUMN section VARCHAR(10) AFTER department,
                ADD COLUMN course VARCHAR(100) AFTER section
            `);
            console.log('✅ Students table updated');

            // Update existing students
            await connection.query(`
                UPDATE students SET section = 'A', course = 'Computer Science' WHERE section IS NULL
            `);
            console.log('✅ Existing students updated with default values');
        } else {
            console.log('ℹ️  Students table already has section and course columns');
        }

        // Check faculty table
        const [facultyCols] = await connection.query(
            "SHOW COLUMNS FROM faculty LIKE 'course'"
        );

        if (facultyCols.length === 0) {
            console.log('\n📝 Adding course column to faculty table...');
            await connection.query(`
                ALTER TABLE faculty 
                ADD COLUMN course VARCHAR(100) AFTER designation
            `);
            console.log('✅ Faculty table updated');

            // Update existing faculty
            await connection.query(`
                UPDATE faculty SET course = 'Computer Science' WHERE course IS NULL
            `);
            console.log('✅ Existing faculty updated with default values');
        } else {
            console.log('ℹ️  Faculty table already has course column');
        }

        console.log('\n🎉 Database schema updated successfully!');
        console.log('\n📊 Updated Structure:');
        console.log('Students: name, email, roll_number, department, section, course, phone');
        console.log('Faculty: name, email, department, designation, course, phone');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateSchema();
