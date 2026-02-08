<?php
require_once '../config/database.php';
require_once '../config/functions.php';
requireStudent();

$conn = getDBConnection();

// Get appointments
$stmt = $conn->prepare("
    SELECT a.appointment_id, f.name AS faculty_name, f.department, 
           t.date, t.start_time, t.end_time, a.reason, a.status, a.created_at
    FROM appointments a 
    JOIN faculty f ON a.faculty_id = f.faculty_id 
    JOIN time_slots t ON a.slot_id = t.slot_id
    WHERE a.student_id = ?
    ORDER BY t.date DESC, t.start_time DESC
");
$stmt->bind_param("i", $_SESSION['student_id']);
$stmt->execute();
$appointments = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get statistics
$total = count($appointments);
$approved = count(array_filter($appointments, fn($a) => $a['status'] === 'Approved'));
$pending = count(array_filter($appointments, fn($a) => $a['status'] === 'Pending'));
$rejected = count(array_filter($appointments, fn($a) => $a['status'] === 'Rejected'));

$stmt->close();
$conn->close();

$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - EduMeet</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
        <?php if ($flash): ?>
            <div class="alert alert-<?php echo $flash['type']; ?>">
                <?php echo $flash['message']; ?>
            </div>
        <?php endif; ?>

        <h1 class="mb-3" style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Student Dashboard
        </h1>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon primary">📚</div>
                <div class="stat-value"><?php echo $total; ?></div>
                <div class="stat-label">Total Appointments</div>
                <div class="stat-progress">
                    <div class="stat-progress-bar" data-width="100"></div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon success">✅</div>
                <div class="stat-value"><?php echo $approved; ?></div>
                <div class="stat-label">Approved</div>
                <div class="stat-progress">
                    <div class="stat-progress-bar" data-width="<?php echo $total > 0 ? ($approved/$total)*100 : 0; ?>"></div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon warning">⏳</div>
                <div class="stat-value"><?php echo $pending; ?></div>
                <div class="stat-label">Pending</div>
                <div class="stat-progress">
                    <div class="stat-progress-bar" data-width="<?php echo $total > 0 ? ($pending/$total)*100 : 0; ?>"></div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon danger">❌</div>
                <div class="stat-value"><?php echo $rejected; ?></div>
                <div class="stat-label">Rejected</div>
                <div class="stat-progress">
                    <div class="stat-progress-bar" data-width="<?php echo $total > 0 ? ($rejected/$total)*100 : 0; ?>"></div>
                </div>
            </div>
        </div>

        <!-- Chart -->
        <div class="card glass-card mb-3">
            <h3 class="mb-2">Appointment Status Overview</h3>
            <canvas id="statusChart" style="max-height: 300px;"></canvas>
        </div>

        <!-- Quick Action -->
        <div class="text-center mb-3">
            <a href="book_appointment.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 3rem;">
                📅 Book New Appointment
            </a>
        </div>

        <!-- Appointments List -->
        <div class="card">
            <h3 class="mb-2">My Appointments</h3>
            
            <?php if (empty($appointments)): ?>
                <p class="text-center" style="color: var(--text-secondary); padding: 2rem;">
                    No appointments yet. Book your first appointment!
                </p>
            <?php else: ?>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Faculty</th>
                                <th>Department</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($appointments as $apt): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($apt['faculty_name']); ?></td>
                                    <td><?php echo htmlspecialchars($apt['department']); ?></td>
                                    <td><?php echo formatDate($apt['date']); ?></td>
                                    <td><?php echo formatTime($apt['start_time']) . ' - ' . formatTime($apt['end_time']); ?></td>
                                    <td><?php echo htmlspecialchars($apt['reason']); ?></td>
                                    <td>
                                        <span class="badge badge-<?php echo getStatusClass($apt['status']); ?>">
                                            <?php echo $apt['status']; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?php if ($apt['status'] === 'Pending'): ?>
                                            <a href="cancel_appointment.php?id=<?php echo $apt['appointment_id']; ?>" 
                                               class="btn btn-danger" 
                                               style="padding: 0.4rem 1rem; font-size: 0.85rem;"
                                               onclick="return confirm('Are you sure you want to cancel this appointment?')">
                                                Cancel
                                            </a>
                                        <?php else: ?>
                                            <span style="color: var(--text-secondary);">-</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="../assets/js/main.js"></script>
    <script>
        // Status Chart
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                    data: [<?php echo $approved; ?>, <?php echo $pending; ?>, <?php echo $rejected; ?>],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            padding: 20,
                            font: { size: 14 }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
