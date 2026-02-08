// ========================================
// EduMeet - Main JavaScript
// ========================================

// Theme System - Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'ocean';
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (menu) {
        menu.classList.toggle('active');
    }
    
    if (toggle) {
        toggle.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (menu && toggle && navbar) {
        if (!navbar.contains(event.target) && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    }
});

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.navbar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (toggle) toggle.classList.remove('active');
            }
        });
    });
});

// Theme Toggle (Legacy - kept for compatibility)
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'ocean';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Animated Counter
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        animateValue(counter, 0, target, 2000);
    });
}

// Progress Bars
function initProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.stat-progress-bar');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '100';
            bar.style.width = width + '%';
        });
    }, 500);
}

// Auto-hide Alerts
function initAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.animation = 'slideOutUp 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
}

// Show Alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${getAlertColor(type)};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <span style="font-size: 1.2rem;">${getAlertIcon(type)}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

function getAlertColor(type) {
    const colors = {
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

function getAlertIcon(type) {
    const icons = {
        success: '✓',
        danger: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || 'ℹ';
}

// API Helper Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error' };
    }
}

// Check Session
async function checkSession() {
    const data = await apiRequest('/api/auth/session');
    return data;
}

// Logout
async function logout() {
    const data = await apiRequest('/api/auth/logout', { method: 'POST' });
    if (data.success) {
        window.location.href = '/';
    }
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format Time
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Get Status Class
function getStatusClass(status) {
    const classes = {
        'Pending': 'warning',
        'Approved': 'success',
        'Rejected': 'danger',
        'Cancelled': 'secondary'
    };
    return classes[status] || 'info';
}

// Notifications
let notificationInterval;

async function loadNotifications() {
    try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        
        if (data.success) {
            updateNotificationBadge(data.unreadCount);
            displayNotifications(data.notifications);
        }
    } catch (error) {
        console.error('Notification error:', error);
    }
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function displayNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = '<div class="notification-item">No notifications</div>';
        return;
    }
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.is_read ? '' : 'unread'}">
            <div class="notification-content">
                <p>${notif.message}</p>
                <small>${formatDate(notif.created_at)}</small>
            </div>
        </div>
    `).join('');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const bell = document.querySelector('.notification-icon');
    
    if (dropdown && bell && !dropdown.contains(event.target) && !bell.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

async function markNotificationRead(notificationId) {
    try {
        await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'POST'
        });
        loadNotifications();
    } catch (error) {
        console.error('Mark read error:', error);
    }
}

async function markAllNotificationsRead() {
    try {
        await fetch('/api/notifications/mark-all-read', {
            method: 'POST'
        });
        loadNotifications();
    } catch (error) {
        console.error('Mark all read error:', error);
    }
}

// Add simple animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initCountUp();
    initProgressBars();
    initAlerts();
    
    // Load notifications if user is logged in
    checkSession().then(session => {
        if (session.isLoggedIn) {
            loadNotifications();
            notificationInterval = setInterval(loadNotifications, 30000);
        }
    }).catch(err => {
        console.log('Session check skipped');
    });
});


// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu) {
        menu.classList.toggle('active');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
});

// Close mobile menu when clicking on a menu item
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.navbar-menu a, .navbar-menu button');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menu = document.getElementById('navbarMenu');
            const overlay = document.getElementById('mobileMenuOverlay');
            if (menu && window.innerWidth <= 768) {
                menu.classList.remove('active');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    });
});
