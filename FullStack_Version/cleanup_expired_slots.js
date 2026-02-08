// ========================================
// Automatic Cleanup of Expired Time Slots
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupExpiredSlots() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🧹 Starting cleanup of expired slots...');

        // Get current date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        // Find expired slots (date is past OR date is today but time has passed)
        const [expiredSlots] = await connection.query(`
            SELECT slot_id, date, start_time, end_time,
                   (SELECT COUNT(*) FROM appointments WHERE slot_id = time_slots.slot_id) as booking_count
            FROM time_slots 
            WHERE date < ? OR (date = ? AND end_time < ?)
        `, [currentDate, currentDate, currentTime]);

        if (expiredSlots.length === 0) {
            console.log('✅ No expired slots found');
            return;
        }

        console.log(`📋 Found ${expiredSlots.length} expired slots`);

        let deletedCount = 0;
        let keptCount = 0;

        for (const slot of expiredSlots) {
            if (slot.booking_count > 0) {
                // Keep slots with bookings for history
                console.log(`  ⏭️  Keeping slot ${slot.slot_id} (has ${slot.booking_count} booking(s))`);
                keptCount++;
            } else {
                // Delete slots without bookings
                await connection.query('DELETE FROM time_slots WHERE slot_id = ?', [slot.slot_id]);
                console.log(`  🗑️  Deleted slot ${slot.slot_id} (${slot.date} ${slot.start_time}-${slot.end_time})`);
                deletedCount++;
            }
        }

        console.log('\n📊 Cleanup Summary:');
        console.log(`  ✅ Deleted: ${deletedCount} empty expired slots`);
        console.log(`  📌 Kept: ${keptCount} slots with bookings (for history)`);
        console.log('🎉 Cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run cleanup
cleanupExpiredSlots();
