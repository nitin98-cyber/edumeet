<?php
require_once 'config/database.php';
require_once 'config/functions.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $user_type = sanitize($_POST['user_type']);
    
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND user_type = ?");
    $stmt->bind_param("ss", $email, $user_type);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (verifyPassword($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['user_type'] = $user['user_type'];
            
            // Get additional user info
            if ($user_type === 'student') {
                $stmt = $conn->prepare("SELECT student_id, name FROM students WHERE user_id = ?");
                $stmt->bind_param("i", $user['user_id']);
                $stmt->execute();
                $student = $stmt->get_result()->fetch_assoc();
                $_SESSION['student_id'] = $student['student_id'];
                $_SESSION['name'] = $student['name'];
                header('Location: student/dashboard.php');
            } elseif ($user_type === 'faculty') {
                $stmt = $conn->prepare("SELECT faculty_id, name FROM faculty WHERE user_id = ?");
                $stmt->bind_param("i", $user['user_id']);
                $stmt->execute();
                $faculty = $stmt->get_result()->fetch_assoc();
                $_SESSION['faculty_id'] = $faculty['faculty_id'];
                $_SESSION['name'] = $faculty['name'];
                header('Location: faculty/dashboard.php');
            } elseif ($user_type === 'admin') {
                $_SESSION['name'] = 'Admin';
                header('Location: admin/dashboard.php');
            }
            exit();
        } else {
            $error = 'Invalid email or password';
        }
    } else {
        $error = 'Invalid email or password';
    }
    
    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - EduMeet</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="animated-bg"></div>
    
    <nav class="navbar">
        <div class="navbar-container">
            <a href="index.php" class="navbar-brand">🎓 EduMeet</a>
            <ul class="navbar-menu">
                <li><a href="index.php">Home</a></li>
                <li><button class="theme-toggle" onclick="toggleTheme()">🌙</button></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="card glass-card" style="max-width: 500px; margin: 4rem auto;">
            <h2 class="text-center mb-3" style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Login to EduMeet
            </h2>
            
            <?php if ($error): ?>
                <div class="alert alert-danger">
                    ⚠️ <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="" id="loginForm">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-control" required placeholder="Enter your email">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" required placeholder="Enter your password">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Login As</label>
                    <select name="user_type" class="form-control" required>
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Login
                </button>
            </form>
            
            <div class="text-center mt-3">
                <p style="color: var(--text-secondary);">
                    Default credentials available in LOGIN_CREDENTIALS.md
                </p>
            </div>
        </div>
    </div>

    <script src="assets/js/main.js"></script>
</body>
</html>
