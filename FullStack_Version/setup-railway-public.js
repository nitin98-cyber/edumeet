// Railway Database Setup - Public Access
const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupDatabase() {
    console.log('🚀 Setting up Railway Database...\n');

    const config = {
        host: 'mysql.railway.internal',
        user: 'root',
        password: 'CLODVYkKYlXrPegsMYFQliFbkdeCJHJk',
        database: 'railway',
        port: 3306,
        multipleStatements: true
    };

    console.log('📡 Connecting to Railway MySQL...\n');

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected!\n');

        console.log('📄 Reading SQL file...');
        const sql = fs.readFileSync('railway_setup.sql', 'utf8');

        console.log('⚙️  Executing SQL...\n');
        await connection.query(sql);

        console.log('✅ Database setup complete!\n');

        const [tables] = await connection.query('SHOW TABLES');
        console.log(`✓ Created ${tables.length} tables\n`);

        console.log('🎉 Success! Your database is ready.\n');
        console.log('📝 Login Credentials:');
        console.log('   Admin: admin@edumeet.com / admin123');
        console.log('   Faculty: priya.sharma@college.edu / admin123');
        console.log('   Student: rahul.kumar@student.edu / admin123');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
