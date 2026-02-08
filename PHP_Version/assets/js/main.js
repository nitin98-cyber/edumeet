// ========================================
// EduMeet - Main JavaScript
// ========================================

// Theme Toggle
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle');
    if (icon) {
        icon.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
}

// Count Up Animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize count-up animations
function initCountUp() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(element => {
        const finalValue = parseInt(element.textContent);
        element.textContent = '0';
        
        // Use Intersection Observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(element, 0, finalValue, 2000);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Progress Bar Animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.stat-progress-bar');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Auto-hide alerts
function initAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.animation = 'slideOutUp 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
}

// Smooth Scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Notification System
async function loadNotifications() {
    try {
        const response = await fetch('/PHP_Version/api/notifications.php');
        const data = await response.json();
        
        if (data.success) {
            updateNotificationBadge(data.count);
            displayNotifications(data.notifications);
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

function displayNotifications(notifications) {
    const container = document.querySelector('.notifications-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No notifications</p>';
        return;
    }
    
    notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-item ${notif.is_read ? 'read' : 'unread'}`;
        item.innerHTML = `
            <div class="notification-content">
                <p>${notif.message}</p>
                <small>${notif.created_at}</small>
            </div>
            ${!notif.is_read ? `<button onclick="markAsRead(${notif.notification_id})" class="btn-mark-read">✓</button>` : ''}
        `;
        container.appendChild(item);
    });
}

async function markAsRead(notificationId) {
    try {
        const response = await fetch(`/PHP_Version/api/notifications.php?action=mark_read&id=${notificationId}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            loadNotifications();
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Confirm Dialog
function confirmAction(message) {
    return confirm(message);
}

// Table Search
function initTableSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!input || !table) return;
    
    input.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initCountUp();
    initProgressBars();
    initAlerts();
    
    // Load notifications if user is logged in
    if (document.querySelector('.notification-badge')) {
        loadNotifications();
        setInterval(loadNotifications, 30000); // Refresh every 30 seconds
    }
});

// Add slideOutUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
