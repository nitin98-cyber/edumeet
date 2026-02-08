<?php
require_once 'config/database.php';
require_once 'config/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduMeet - Faculty Appointment System</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="animated-bg"></div>
    
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-container">
            <a href="index.php" class="navbar-brand">
                🎓 EduMeet
            </a>
            <ul class="navbar-menu">
                <?php if (isLoggedIn()): ?>
                    <li><a href="<?php echo isStudent() ? 'student/dashboard.php' : (isFaculty() ? 'faculty/dashboard.php' : 'admin/dashboard.php'); ?>">Dashboard</a></li>
                    <li><a href="logout.php">Logout</a></li>
                <?php else: ?>
                    <li><a href="login.php">Login</a></li>
                <?php endif; ?>
                <li><button class="theme-toggle" onclick="toggleTheme()">🌙</button></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="container">
        <div class="card glass-card text-center" style="margin-top: 4rem; padding: 4rem 2rem;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Welcome to EduMeet
            </h1>
            <p style="font-size: 1.3rem; color: var(--text-secondary); margin-bottom: 2rem;">
                Streamline Faculty-Student Appointments with Ease
            </p>
            
            <?php if (!isLoggedIn()): ?>
                <div class="d-flex justify-between align-center gap-2" style="justify-content: center;">
                    <a href="login.php" class="btn btn-primary">Get Started</a>
                </div>
            <?php else: ?>
                <a href="<?php echo isStudent() ? 'student/dashboard.php' : (isFaculty() ? 'faculty/dashboard.php' : 'admin/dashboard.php'); ?>" class="btn btn-primary">
                    Go to Dashboard
                </a>
            <?php endif; ?>
        </div>

        <!-- Features Section -->
        <div class="stats-grid" style="margin-top: 4rem;">
            <div class="card glass-card text-center">
                <div class="stat-icon primary" style="margin: 0 auto;">📚</div>
                <h3>Easy Booking</h3>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Book appointments with faculty members in just a few clicks
                </p>
            </div>
            
            <div class="card glass-card text-center">
                <div class="stat-icon success" style="margin: 0 auto;">⏰</div>
                <h3>Real-time Updates</h3>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Get instant notifications about appointment status
                </p>
            </div>
            
            <div class="card glass-card text-center">
                <div class="stat-icon warning" style="margin: 0 auto;">📊</div>
                <h3>Smart Dashboard</h3>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Track all your appointments in one beautiful interface
                </p>
            </div>
            
            <div class="card glass-card text-center">
                <div class="stat-icon danger" style="margin: 0 auto;">🔒</div>
                <h3>Secure & Private</h3>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Your data is protected with industry-standard security
                </p>
            </div>
        </div>
    </div>

    <script src="assets/js/main.js"></script>
</body>
</html>
