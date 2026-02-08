// ========================================
// Add Sample Data for Testing
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleData() {
    let connection;
    
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database');

        // Get faculty ID
        const [faculty] = await connection.query(
            'SELECT f.faculty_id FROM faculty f JOIN users u ON f.user_id = u.user_id WHERE u.email = ?',
            ['priya.sharma@college.edu']
        );

        if (faculty.length === 0) {
            console.log('❌ Faculty not found');
            return;
        }

        const facultyId = faculty[0].faculty_id;
        console.log(`✅ Found faculty ID: ${facultyId}`);

        // Get student ID
        const [students] = await connection.query(
            'SELECT s.student_id FROM students s JOIN users u ON s.user_id = u.user_id WHERE u.email = ?',
            ['rahul.kumar@student.edu']
        );

        if (students.length === 0) {
            console.log('❌ Student not found');
            return;
        }

        const studentId = students[0].student_id;
        console.log(`✅ Found student ID: ${studentId}`);

        // Add time slots for next 7 days
        console.log('\n📅 Adding time slots...');
        const today = new Date();
        const slots = [];

        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            // Morning slot
            await connection.query(
                'INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
                [facultyId, dateStr, '09:00:00', '10:00:00', true]
            );

            // Afternoon slot
            await connection.query(
                'INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
                [facultyId, dateStr, '14:00:00', '15:00:00', true]
            );

            // Evening slot
            await connection.query(
                'INSERT INTO time_slots (faculty_id, date, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
                [facultyId, dateStr, '16:00:00', '17:00:00', true]
            );

            console.log(`  ✅ Added slots for ${dateStr}`);
        }

        // Get some slot IDs
        const [slotIds] = await connection.query(
            'SELECT slot_id FROM time_slots WHERE faculty_id = ? ORDER BY date LIMIT 5',
            [facultyId]
        );

        // Add sample appointments
        console.log('\n📝 Adding sample appointments...');
        
        if (slotIds.length >= 5) {
            // Approved appointment
            await connection.query(
                'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [studentId, facultyId, slotIds[0].slot_id, 'Discussion about project guidelines', 'Approved']
            );
            console.log('  ✅ Added approved appointment');

            // Approved appointment 2
            await connection.query(
                'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [studentId, facultyId, slotIds[1].slot_id, 'Doubt clarification for assignment', 'Approved']
            );
            console.log('  ✅ Added approved appointment 2');

            // Pending appointment
            await connection.query(
                'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [studentId, facultyId, slotIds[2].slot_id, 'Career guidance and internship advice', 'Pending']
            );
            console.log('  ✅ Added pending appointment');

            // Pending appointment 2
            await connection.query(
                'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [studentId, facultyId, slotIds[3].slot_id, 'Research paper discussion', 'Pending']
            );
            console.log('  ✅ Added pending appointment 2');

            // Rejected appointment
            await connection.query(
                'INSERT INTO appointments (student_id, faculty_id, slot_id, reason, status) VALUES (?, ?, ?, ?, ?)',
                [studentId, facultyId, slotIds[4].slot_id, 'General query', 'Rejected']
            );
            console.log('  ✅ Added rejected appointment');
        }

        console.log('\n🎉 Sample data added successfully!');
        console.log('\n📊 Summary:');
        console.log('  - 21 time slots created (7 days × 3 slots)');
        console.log('  - 5 appointments created');
        console.log('  - 2 Approved, 2 Pending, 1 Rejected');
        console.log('\n✨ Your dashboard will now look populated!');
        console.log('🌐 Login at: http://localhost:3000');
        console.log('👤 Student: rahul.kumar@student.edu / student123');
        console.log('👨‍🏫 Faculty: priya.sharma@college.edu / faculty123');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the script
addSampleData();
