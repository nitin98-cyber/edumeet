// One-time database setup route
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Setup database endpoint - visit once to create tables
router.get('/setup-database', async (req, res) => {
    try {
        console.log('Starting database setup...');
        
        // Read SQL file
        const sqlFile = path.join(__dirname, '..', 'railway_setup.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await pool.query(statement);
            }
        }
        
        // Verify tables
        const [tables] = await pool.query('SHOW TABLES');
        
        res.send(`
            <html>
            <head>
                <title>Database Setup Complete</title>
                <style>
                    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
                    .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; }
                    .info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; margin-top: 20px; border-radius: 5px; }
                    h1 { color: #155724; }
                    code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <div class="success">
                    <h1>✅ Database Setup Complete!</h1>
                    <p>Created ${tables.length} tables successfully:</p>
                    <ul>
                        ${tables.map(t => `<li>${Object.values(t)[0]}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="info">
                    <h2>🔐 Login Credentials</h2>
                    <p><strong>Admin:</strong><br>
                    Email: <code>admin@edumeet.com</code><br>
                    Password: <code>admin123</code></p>
                    
                    <p><strong>Faculty:</strong><br>
                    Email: <code>priya.sharma@college.edu</code><br>
                    Password: <code>admin123</code></p>
                    
                    <p><strong>Student:</strong><br>
                    Email: <code>rahul.kumar@student.edu</code><br>
                    Password: <code>admin123</code></p>
                </div>
                
                <p style="margin-top: 30px;">
                    <a href="/" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Go to Login Page
                    </a>
                </p>
                
                <p style="margin-top: 20px; color: #856404; background: #fff3cd; padding: 10px; border-radius: 5px;">
                    <strong>Security Note:</strong> For production, remove this setup route from server.js after first use.
                </p>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).send(`
            <html>
            <head><title>Setup Error</title></head>
            <body style="font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px;">
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px;">
                    <h1 style="color: #721c24;">❌ Setup Failed</h1>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Check Railway logs for details.</p>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;
