// ========================================
// Delete All Demo Data
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function deleteDemoData() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');
        console.log('⚠️  WARNING: This will delete ALL demo data!');
        console.log('   - All appointments');
        console.log('   - All time slots');
        console.log('   - All notifications');
        console.log('   - Demo students and faculty (keeps admin)\n');

        // Count current data
        const [appointmentCount] = await connection.query('SELECT COUNT(*) as count FROM appointments');
        const [slotCount] = await connection.query('SELECT COUNT(*) as count FROM time_slots');
        const [notificationCount] = await connection.query('SELECT COUNT(*) as count FROM notifications');
        const [studentCount] = await connection.query('SELECT COUNT(*) as count FROM students');
        const [facultyCount] = await connection.query('SELECT COUNT(*) as count FROM faculty');

        console.log('📊 Current Data:');
        console.log(`   Appointments: ${appointmentCount[0].count}`);
        console.log(`   Time Slots: ${slotCount[0].count}`);
        console.log(`   Notifications: ${notificationCount[0].count}`);
        console.log(`   Students: ${studentCount[0].count}`);
        console.log(`   Faculty: ${facultyCount[0].count}\n`);

        console.log('🗑️  Starting deletion...\n');

        // Delete appointments first (foreign key constraint)
        console.log('1️⃣  Deleting appointments...');
        await connection.query('DELETE FROM appointments');
        console.log('   ✅ All appointments deleted');

        // Delete time slots
        console.log('2️⃣  Deleting time slots...');
        await connection.query('DELETE FROM time_slots');
        console.log('   ✅ All time slots deleted');

        // Delete notifications
        console.log('3️⃣  Deleting notifications...');
        await connection.query('DELETE FROM notifications');
        console.log('   ✅ All notifications deleted');

        // Get admin user_id to keep it
        const [adminUser] = await connection.query(
            "SELECT user_id FROM users WHERE email = 'admin@edumeet.com'"
        );

        if (adminUser.length > 0) {
            const adminUserId = adminUser[0].user_id;

            // Delete students (except admin-related)
            console.log('4️⃣  Deleting demo students...');
            await connection.query('DELETE FROM students WHERE user_id != ?', [adminUserId]);
            console.log('   ✅ Demo students deleted');

            // Delete faculty (except admin-related)
            console.log('5️⃣  Deleting demo faculty...');
            await connection.query('DELETE FROM faculty WHERE user_id != ?', [adminUserId]);
            console.log('   ✅ Demo faculty deleted');

            // Delete users (except admin)
            console.log('6️⃣  Deleting demo user accounts...');
            await connection.query('DELETE FROM users WHERE user_id != ? AND user_type != ?', [adminUserId, 'admin']);
            console.log('   ✅ Demo user accounts deleted');
        } else {
            console.log('⚠️  Admin user not found, skipping user deletion');
        }

        // Reset auto-increment IDs
        console.log('\n7️⃣  Resetting auto-increment IDs...');
        await connection.query('ALTER TABLE appointments AUTO_INCREMENT = 1');
        await connection.query('ALTER TABLE time_slots AUTO_INCREMENT = 1');
        await connection.query('ALTER TABLE notifications AUTO_INCREMENT = 1');
        console.log('   ✅ Auto-increment IDs reset');

        // Final count
        const [finalAppointments] = await connection.query('SELECT COUNT(*) as count FROM appointments');
        const [finalSlots] = await connection.query('SELECT COUNT(*) as count FROM time_slots');
        const [finalNotifications] = await connection.query('SELECT COUNT(*) as count FROM notifications');
        const [finalStudents] = await connection.query('SELECT COUNT(*) as count FROM students');
        const [finalFaculty] = await connection.query('SELECT COUNT(*) as count FROM faculty');

        console.log('\n📊 Final Data:');
        console.log(`   Appointments: ${finalAppointments[0].count}`);
        console.log(`   Time Slots: ${finalSlots[0].count}`);
        console.log(`   Notifications: ${finalNotifications[0].count}`);
        console.log(`   Students: ${finalStudents[0].count}`);
        console.log(`   Faculty: ${finalFaculty[0].count}`);

        console.log('\n🎉 Demo data deleted successfully!');
        console.log('\n✅ Admin account preserved:');
        console.log('   Email: admin@edumeet.com');
        console.log('   Password: admin123');
        console.log('\n💡 You can now add real students and faculty through admin panel!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run deletion
deleteDemoData();
