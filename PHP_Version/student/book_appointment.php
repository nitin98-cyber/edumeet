<?php
require_once '../config/database.php';
require_once '../config/functions.php';
requireStudent();

$conn = getDBConnection();

// Get all faculty
$result = $conn->query("SELECT faculty_id, name, department, designation, phone FROM faculty ORDER BY name");
$faculty_list = $result->fetch_all(MYSQLI_ASSOC);

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Appointment - EduMeet</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="animated-bg"></div>
    
    <nav class="navbar">
        <div class="navbar-container">
            <a href="../index.php" class="navbar-brand">🎓 EduMeet</a>
            <ul class="navbar-menu">
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="book_appointment.php">Book Appointment</a></li>
                <li><span style="color: white;">Welcome, <?php echo $_SESSION['name']; ?></span></li>
                <li><a href="../logout.php">Logout</a></li>
                <li><button class="theme-toggle" onclick="toggleTheme()">🌙</button></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <h1 class="mb-3" style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Select Faculty
        </h1>

        <div class="stats-grid">
            <?php foreach ($faculty_list as $faculty): ?>
                <div class="card glass-card">
                    <div class="stat-icon primary" style="margin-bottom: 1rem;">👨‍🏫</div>
                    <h3 style="margin-bottom: 0.5rem;"><?php echo htmlspecialchars($faculty['name']); ?></h3>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                        <strong>Department:</strong> <?php echo htmlspecialchars($faculty['department']); ?>
                    </p>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                        <strong>Designation:</strong> <?php echo htmlspecialchars($faculty['designation']); ?>
                    </p>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                        <strong>Phone:</strong> <?php echo htmlspecialchars($faculty['phone']); ?>
                    </p>
                    <a href="view_slots.php?faculty_id=<?php echo $faculty['faculty_id']; ?>" class="btn btn-primary" style="width: 100%;">
                        View Available Slots
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <script src="../assets/js/main.js"></script>
</body>
</html>
