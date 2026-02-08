<?php
// Helper Functions

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Check user type
function isStudent() {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'student';
}

function isFaculty() {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'faculty';
}

function isAdmin() {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'admin';
}

// Redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /PHP_Version/login.php');
        exit();
    }
}

// Redirect based on user type
function requireStudent() {
    requireLogin();
    if (!isStudent()) {
        header('Location: /PHP_Version/index.php');
        exit();
    }
}

function requireFaculty() {
    requireLogin();
    if (!isFaculty()) {
        header('Location: /PHP_Version/index.php');
        exit();
    }
}

function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        header('Location: /PHP_Version/index.php');
        exit();
    }
}

// Sanitize input
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Format date
function formatDate($date) {
    return date('d M Y', strtotime($date));
}

// Format time
function formatTime($time) {
    return date('h:i A', strtotime($time));
}

// Get status badge class
function getStatusClass($status) {
    $classes = [
        'Pending' => 'warning',
        'Approved' => 'success',
        'Rejected' => 'danger',
        'Cancelled' => 'secondary',
        'Completed' => 'info'
    ];
    return $classes[$status] ?? 'secondary';
}

// Flash message functions
function setFlash($message, $type = 'info') {
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
}

function getFlash() {
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        $type = $_SESSION['flash_type'] ?? 'info';
        unset($_SESSION['flash_message']);
        unset($_SESSION['flash_type']);
        return ['message' => $message, 'type' => $type];
    }
    return null;
}

// Password hashing
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}
?>
