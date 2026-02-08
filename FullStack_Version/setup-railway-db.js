// ================================================
// Railway Database Setup Script
// Run this locally to set up your Railway MySQL database
// ================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log('🚀 Starting Railway Database Setup...\n');

    // Read Railway environment variables
    const config = {
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT || 3306,
        multipleStatements: true // Allow multiple SQL statements
    };

    // Validate configuration
    if (!config.host || !config.user || !config.password || !config.database) {
        console.error('❌ Error: Missing Railway MySQL environment variables!');
        console.log('\n📋 Required variables:');
        console.log('   - MYSQLHOST');
        console.log('   - MYSQLUSER');
        console.log('   - MYSQLPASSWORD');
        console.log('   - MYSQLDATABASE');
        console.log('   - MYSQLPORT (optional, defaults to 3306)');
        console.log('\n💡 Get these from Railway → MySQL service → Variables tab');
        process.exit(1);
    }

    console.log('📡 Connecting to Railway MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}\n`);

    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to Railway MySQL!\n');

        // Read SQL file
        console.log('📄 Reading railway_setup.sql...');
        const sqlFile = path.join(__dirname, 'railway_setup.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute SQL
        console.log('⚙️  Executing SQL statements...\n');
        await connection.query(sql);

        console.log('✅ Database setup complete!\n');

        // Verify tables created
        console.log('🔍 Verifying tables...');
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`   Found ${tables.length} tables:`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   ✓ ${tableName}`);
        });

        // Count users
        console.log('\n👥 Checking users...');
        const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`   Total users: ${users[0].count}`);

        const [roles] = await connection.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        roles.forEach(role => {
            console.log(`   - ${role.role}: ${role.count}`);
        });

        console.log('\n🎉 Setup successful!');
        console.log('\n📝 Default Login Credentials:');
        console.log('   Admin:');
        console.log('     Email: admin@edumeet.com');
        console.log('     Password: admin123');
        console.log('\n   Faculty:');
        console.log('     Email: priya.sharma@college.edu');
        console.log('     Password: admin123');
        console.log('\n   Student:');
        console.log('     Email: rahul.kumar@student.edu');
        console.log('     Password: admin123');

        console.log('\n🌐 Your app URL:');
        console.log('   https://edumeet-production.up.railway.app');

        console.log('\n✨ Next steps:');
        console.log('   1. Add environment variables to your Node.js service:');
        console.log('      - SESSION_SECRET=edumeet-railway-secret-2024-xyz789');
        console.log('      - NODE_ENV=production');
        console.log('   2. Wait for Railway to redeploy');
        console.log('   3. Visit your app and login!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Connection refused. Check:');
            console.log('   - Railway MySQL service is running');
            console.log('   - Connection details are correct');
            console.log('   - Your IP is allowed (Railway allows all by default)');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Access denied. Check:');
            console.log('   - MYSQLUSER and MYSQLPASSWORD are correct');
            console.log('   - Copy them exactly from Railway Variables tab');
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Connection closed.');
        }
    }
}

// Run setup
setupDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
