// ========================================
// Faculty Dashboard JavaScript
// ========================================

// Load dashboard data
async function loadDashboard() {
    try {
        const response = await fetch('/api/faculty/dashboard');
        const data = await response.json();
        
        if (data.success) {
            updateStatistics(data.stats);
            displaySlots(data.slots);
            displayRequests(data.appointments);
            createStatusChart(data.stats);
        } else {
            showAlert('Failed to load dashboard data', 'danger');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard', 'danger');
    }
}

// Update statistics
function updateStatistics(stats) {
    const total = stats.total || 0;
    const pending = stats.pending || 0;
    const approved = stats.approved || 0;
    const slots = stats.slots || 0;
    
    // Get elements and animate
    const totalEl = document.getElementById('totalAppointments');
    const pendingEl = document.getElementById('pendingRequests');
    const approvedEl = document.getElementById('approvedAppointments');
    const slotsEl = document.getElementById('availableSlots');
    
    if (totalEl) animateValue(totalEl, 0, total, 2000);
    if (pendingEl) animateValue(pendingEl, 0, pending, 2000);
    if (approvedEl) animateValue(approvedEl, 0, approved, 2000);
    if (slotsEl) animateValue(slotsEl, 0, slots, 2000);
    
    // Update progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.stat-progress-bar');
        if (progressBars[0]) progressBars[0].style.width = '100%';
        if (progressBars[1]) progressBars[1].style.width = total > 0 ? `${(pending/total)*100}%` : '0%';
        if (progressBars[2]) progressBars[2].style.width = total > 0 ? `${(approved/total)*100}%` : '0%';
        if (progressBars[3]) progressBars[3].style.width = slots > 0 ? '100%' : '0%';
    }, 500);
}

// Create status chart
function createStatusChart(stats) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                data: [stats.approved || 0, stats.pending || 0, stats.rejected || 0],
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
}

// Display time slots
function displaySlots(slots) {
    const container = document.getElementById('slotsContainer');
    
    if (!slots || slots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>No time slots created yet</p>
                <button class="btn btn-primary" onclick="openSlotModal()">Add Your First Slot</button>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="slots-grid">
            ${slots.map(slot => `
                <div class="slot-card glass-card animate-scale-in">
                    <div class="slot-header">
                        <div class="slot-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(slot.date)}
                        </div>
                        <button class="btn-icon-danger" onclick="deleteSlot(${slot.slot_id})" title="Delete Slot">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="slot-time">
                        <i class="fas fa-clock"></i>
                        ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}
                    </div>
                    <div class="slot-bookings">
                        <i class="fas fa-users"></i>
                        ${slot.booking_count || 0} booking(s)
                    </div>
                    ${slot.booking_count > 0 ? `
                        <button class="btn btn-sm btn-secondary" onclick="viewSlotBookings(${slot.slot_id})">
                            <i class="fas fa-eye"></i> View Bookings
                        </button>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Display appointment requests
function displayRequests(appointments) {
    const container = document.getElementById('requestsContainer');
    
    if (!appointments || appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No appointment requests</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="requests-list">
            ${appointments.map(apt => `
                <div class="request-card glass-card animate-fade-in">
                    <div class="request-header">
                        <div class="student-info">
                            <i class="fas fa-user-graduate"></i>
                            <div>
                                <h4>${apt.student_name}</h4>
                                <p>${apt.roll_number} - ${apt.department}</p>
                            </div>
                        </div>
                        <span class="badge badge-${getStatusClass(apt.status)}">${apt.status}</span>
                    </div>
                    <div class="request-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(apt.date)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${formatTime(apt.start_time)} - ${formatTime(apt.end_time)}</span>
                        </div>
                    </div>
                    <div class="request-reason">
                        <strong>Reason:</strong> ${apt.reason}
                    </div>
                    ${apt.status === 'Pending' ? `
                        <div class="request-actions">
                            <button class="btn btn-success" onclick="approveAppointment(${apt.appointment_id})">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-danger" onclick="rejectAppointment(${apt.appointment_id})">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Open slot modal
function openSlotModal() {
    document.getElementById('slotModal').style.display = 'flex';
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('slotDate').min = today;
}

// Close slot modal
function closeSlotModal() {
    document.getElementById('slotModal').style.display = 'none';
    document.getElementById('slotForm').reset();
}

// Add time slot
async function addTimeSlot() {
    const date = document.getElementById('slotDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!date || !startTime || !endTime) {
        showAlert('Please fill all fields', 'warning');
        return;
    }
    
    if (startTime >= endTime) {
        showAlert('End time must be after start time', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/faculty/slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, startTime, endTime })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Time slot added successfully', 'success');
            closeSlotModal();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to add slot', 'danger');
        }
    } catch (error) {
        console.error('Error adding slot:', error);
        showAlert('Error adding slot', 'danger');
    }
}

// Delete slot
async function deleteSlot(slotId) {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    
    try {
        const response = await fetch(`/api/faculty/slots/${slotId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Slot deleted successfully', 'success');
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to delete slot', 'danger');
        }
    } catch (error) {
        console.error('Error deleting slot:', error);
        showAlert('Error deleting slot', 'danger');
    }
}

// Approve appointment
async function approveAppointment(appointmentId) {
    try {
        const response = await fetch(`/api/faculty/appointments/${appointmentId}/approve`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Appointment approved', 'success');
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to approve', 'danger');
        }
    } catch (error) {
        console.error('Error approving appointment:', error);
        showAlert('Error approving appointment', 'danger');
    }
}

// Reject appointment
async function rejectAppointment(appointmentId) {
    if (!confirm('Are you sure you want to reject this appointment?')) return;
    
    try {
        const response = await fetch(`/api/faculty/appointments/${appointmentId}/reject`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Appointment rejected', 'success');
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to reject', 'danger');
        }
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        showAlert('Error rejecting appointment', 'danger');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});


// View slot bookings
async function viewSlotBookings(slotId) {
    try {
        const response = await fetch(`/api/faculty/slots/${slotId}/bookings`);
        const data = await response.json();
        
        if (data.success) {
            displaySlotBookingsModal(data.bookings, data.slotInfo);
        } else {
            showAlert('Failed to load bookings', 'danger');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showAlert('Error loading bookings', 'danger');
    }
}

function displaySlotBookingsModal(bookings, slotInfo) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.id = 'bookingsModal';
    
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <div class="modal-header">
                <h3><i class="fas fa-users"></i> Slot Bookings</h3>
                <button class="modal-close" onclick="closeBookingsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="booking-info">
                    <p><strong>Date:</strong> ${formatDate(slotInfo.date)}</p>
                    <p><strong>Time:</strong> ${formatTime(slotInfo.start_time)} - ${formatTime(slotInfo.end_time)}</p>
                    <p><strong>Total Bookings:</strong> ${bookings.length}</p>
                </div>
                ${bookings.length > 0 ? `
                    <div class="bookings-list">
                        ${bookings.map(booking => `
                            <div class="booking-card glass-card">
                                <div class="student-info">
                                    <i class="fas fa-user-graduate"></i>
                                    <div>
                                        <h4>${booking.student_name}</h4>
                                        <p>${booking.roll_number} - ${booking.department}</p>
                                        ${booking.section ? `<p>Section: ${booking.section} | Course: ${booking.course}</p>` : ''}
                                        ${booking.phone ? `<p><i class="fas fa-phone"></i> ${booking.phone}</p>` : ''}
                                    </div>
                                </div>
                                <div class="booking-reason">
                                    <strong>Reason:</strong> ${booking.reason}
                                </div>
                                <div class="booking-status">
                                    <span class="badge badge-${getStatusClass(booking.status)}">${booking.status}</span>
                                    <small>Booked on ${formatDate(booking.created_at)}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-center">No bookings for this slot</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeBookingsModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeBookingsModal() {
    const modal = document.getElementById('bookingsModal');
    if (modal) {
        modal.remove();
    }
}

// Export booking history as PDF
function exportBookingHistory() {
    window.location.href = '/api/faculty/export/bookings';
    showAlert('Downloading booking history...', 'success');
}
