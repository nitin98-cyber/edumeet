// Direct Railway Database Setup
const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupDatabase() {
    console.log('🚀 Setting up Railway Database...\n');

    // Your Railway credentials
    const config = {
        host: 'mysql.railway.internal',
        user: 'root',
        password: 'CLODVYkKYlXrPegsMYFQliFbkdeCJHJk',
        database: 'railway',
        port: 3306,
        multipleStatements: true
    };

    console.log('📡 Connecting to Railway MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}\n`);

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected!\n');

        console.log('📄 Reading railway_setup.sql...');
        const sql = fs.readFileSync('railway_setup.sql', 'utf8');

        console.log('⚙️  Creating tables and adding data...\n');
        await connection.query(sql);

        console.log('✅ Database setup complete!\n');

        // Verify
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`✓ Created ${tables.length} tables:`);
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        console.log('\n🎉 Success!\n');
        console.log('🔐 Login Credentials:');
        console.log('   Admin: admin@edumeet.com / admin123');
        console.log('   Faculty: priya.sharma@college.edu / admin123');
        console.log('   Student: rahul.kumar@student.edu / admin123\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.log('\n💡 Cannot connect from local machine.');
            console.log('   mysql.railway.internal only works from Railway servers.\n');
            console.log('   Solution: Use Railway Dashboard to run SQL:');
            console.log('   1. Go to Railway Dashboard → MySQL');
            console.log('   2. Look for "Connect" or "Query" option');
            console.log('   3. Copy content from railway_setup.sql');
            console.log('   4. Paste and execute\n');
        }
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
