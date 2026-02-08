// Test dashboard API
const db = require('./config/database');

async function testDashboard() {
    try {
        console.log('Testing database connection...');
        
        // Test basic queries
        const [studentCount] = await db.query('SELECT COUNT(*) as count FROM students');
        console.log('✅ Students count:', studentCount[0].count);
        
        const [facultyCount] = await db.query('SELECT COUNT(*) as count FROM faculty');
        console.log('✅ Faculty count:', facultyCount[0].count);
        
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');
        console.log('✅ Appointments count:', appointmentCount[0].count);
        
        const [pendingCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Pending']);
        console.log('✅ Pending count:', pendingCount[0].count);
        
        const [approvedCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Approved']);
        console.log('✅ Approved count:', approvedCount[0].count);
        
        const [rejectedCount] = await db.query('SELECT COUNT(*) as count FROM appointments WHERE status = ?', ['Rejected']);
        console.log('✅ Rejected count:', rejectedCount[0].count);
        
        // Test trends query
        const [trendsData] = await db.query(`
            SELECT DATE_FORMAT(t.date, '%a') as day_name, COUNT(*) as count
            FROM appointments a
            JOIN time_slots t ON a.slot_id = t.slot_id
            WHERE t.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY t.date, day_name
            ORDER BY t.date
        `);
        console.log('✅ Trends data:', trendsData);
        
        // Test appointments query
        const [appointments] = await db.query(`
            SELECT a.appointment_id, s.name AS student_name, f.name AS faculty_name, 
                   t.date, t.start_time, t.end_time, a.status, a.created_at
            FROM appointments a 
            JOIN students s ON a.student_id = s.student_id 
            JOIN faculty f ON a.faculty_id = f.faculty_id
            JOIN time_slots t ON a.slot_id = t.slot_id 
            ORDER BY t.date DESC, t.start_time DESC
            LIMIT 5
        `);
        console.log('✅ Sample appointments:', appointments);
        
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testDashboard();
