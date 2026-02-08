// ========================================
// Student Dashboard JavaScript
// ========================================

let selectedSlotId = null;
let selectedFacultyId = null;

// Load dashboard data
async function loadDashboard() {
    try {
        const response = await fetch('/api/student/dashboard');
        const data = await response.json();
        
        if (data.success) {
            updateStatistics(data.stats);
            displayAppointments(data.appointments);
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
    const approved = stats.approved || 0;
    const pending = stats.pending || 0;
    const rejected = stats.rejected || 0;
    
    // Get elements and animate
    const totalEl = document.getElementById('totalAppointments');
    const approvedEl = document.getElementById('approvedAppointments');
    const pendingEl = document.getElementById('pendingAppointments');
    const rejectedEl = document.getElementById('rejectedAppointments');
    
    if (totalEl) animateValue(totalEl, 0, total, 2000);
    if (approvedEl) animateValue(approvedEl, 0, approved, 2000);
    if (pendingEl) animateValue(pendingEl, 0, pending, 2000);
    if (rejectedEl) animateValue(rejectedEl, 0, rejected, 2000);
    
    // Update progress bars
    setTimeout(() => {
        const totalProgress = document.getElementById('totalProgress');
        const approvedProgress = document.getElementById('approvedProgress');
        const pendingProgress = document.getElementById('pendingProgress');
        const rejectedProgress = document.getElementById('rejectedProgress');
        
        if (totalProgress) totalProgress.style.width = '100%';
        if (approvedProgress) approvedProgress.style.width = total > 0 ? `${(approved/total)*100}%` : '0%';
        if (pendingProgress) pendingProgress.style.width = total > 0 ? `${(pending/total)*100}%` : '0%';
        if (rejectedProgress) rejectedProgress.style.width = total > 0 ? `${(rejected/total)*100}%` : '0%';
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

// Display appointments
function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsContainer');
    
    if (!appointments || appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments yet</p>
                <a href="book.html" class="btn btn-primary">Book Your First Appointment</a>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Faculty</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(apt => `
                        <tr class="animate-fade-in">
                            <td>${apt.faculty_name}</td>
                            <td>${apt.department}</td>
                            <td>${formatDate(apt.date)}</td>
                            <td>${formatTime(apt.start_time)} - ${formatTime(apt.end_time)}</td>
                            <td>${apt.reason}</td>
                            <td><span class="badge badge-${getStatusClass(apt.status)}">${apt.status}</span></td>
                            <td>
                                <button class="btn btn-success btn-sm" onclick="downloadReceipt(${apt.appointment_id})" title="Download Receipt">
                                    <i class="fas fa-download"></i>
                                </button>
                                ${apt.status === 'Pending' ? 
                                    `<button class="btn btn-danger btn-sm" onclick="cancelAppointment(${apt.appointment_id})" title="Cancel">
                                        <i class="fas fa-times"></i>
                                    </button>` : 
                                    ''
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Cancel appointment
async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
        const response = await fetch(`/api/student/cancel/${appointmentId}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Appointment cancelled successfully', 'success');
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to cancel appointment', 'danger');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        showAlert('Error cancelling appointment', 'danger');
    }
}

// Load faculty list for booking
async function loadFacultyList() {
    try {
        const response = await fetch('/api/student/faculty');
        const data = await response.json();
        
        if (data.success) {
            displayFacultyList(data.faculty);
        } else {
            showAlert('Failed to load faculty list', 'danger');
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
        showAlert('Error loading faculty list', 'danger');
    }
}

// Display faculty list
function displayFacultyList(facultyList) {
    const grid = document.getElementById('facultyGrid');
    
    if (!facultyList || facultyList.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No faculty available</p></div>';
        return;
    }
    
    const html = facultyList.map(faculty => `
        <div class="faculty-card glass-card animate-scale-in">
            <div class="faculty-icon">
                <i class="fas fa-user-tie"></i>
            </div>
            <h3>${faculty.name}</h3>
            <p class="faculty-detail"><i class="fas fa-building"></i> ${faculty.department}</p>
            <p class="faculty-detail"><i class="fas fa-briefcase"></i> ${faculty.designation}</p>
            <p class="faculty-detail"><i class="fas fa-phone"></i> ${faculty.phone || 'N/A'}</p>
            <button class="btn btn-primary" onclick="viewSlots(${faculty.faculty_id}, '${faculty.name}', '${faculty.department}')">
                <i class="fas fa-clock"></i> View Slots
            </button>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

// View slots for selected faculty
async function viewSlots(facultyId, facultyName, department) {
    selectedFacultyId = facultyId;
    
    document.getElementById('facultySection').style.display = 'none';
    document.getElementById('slotsSection').style.display = 'block';
    
    document.getElementById('selectedFacultyInfo').innerHTML = `
        <div class="faculty-info-card">
            <i class="fas fa-user-tie"></i>
            <div>
                <h3>${facultyName}</h3>
                <p>${department}</p>
            </div>
        </div>
    `;
    
    try {
        const response = await fetch(`/api/student/slots/${facultyId}`);
        const data = await response.json();
        
        if (data.success) {
            displaySlots(data.slots);
        } else {
            showAlert('Failed to load slots', 'danger');
        }
    } catch (error) {
        console.error('Error loading slots:', error);
        showAlert('Error loading slots', 'danger');
    }
}

// Display available slots
function displaySlots(slots) {
    const grid = document.getElementById('slotsGrid');
    
    if (!slots || slots.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No available slots</p></div>';
        return;
    }
    
    const html = slots.map(slot => `
        <div class="slot-card glass-card animate-scale-in">
            <div class="slot-date">
                <i class="fas fa-calendar"></i>
                ${formatDate(slot.date)}
            </div>
            <div class="slot-time">
                <i class="fas fa-clock"></i>
                ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}
            </div>
            <div class="slot-bookings">
                <i class="fas fa-users"></i>
                ${slot.booking_count || 0} booking(s)
            </div>
            <button class="btn btn-primary" onclick="openBookingModal(${slot.slot_id}, '${formatDate(slot.date)}', '${formatTime(slot.start_time)}', '${formatTime(slot.end_time)}')">
                <i class="fas fa-check"></i> Book This Slot
            </button>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

// Back to faculty list
function backToFaculty() {
    document.getElementById('facultySection').style.display = 'block';
    document.getElementById('slotsSection').style.display = 'none';
}

// Open booking modal
function openBookingModal(slotId, date, startTime, endTime) {
    selectedSlotId = slotId;
    
    document.getElementById('bookingDetails').innerHTML = `
        <div class="booking-info">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        </div>
    `;
    
    document.getElementById('bookingModal').style.display = 'flex';
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('appointmentReason').value = '';
}

// Confirm booking
async function confirmBooking() {
    const reason = document.getElementById('appointmentReason').value.trim();
    
    if (!reason) {
        showAlert('Please enter a reason for the appointment', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/student/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slotId: selectedSlotId,
                reason: reason
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Appointment booked successfully!', 'success');
            closeBookingModal();
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Failed to book appointment', 'danger');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showAlert('Error booking appointment', 'danger');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboard();
    }
});

// Download appointment receipt
function downloadReceipt(appointmentId) {
    window.location.href = `/api/student/receipt/${appointmentId}`;
    showAlert('Downloading receipt...', 'success');
}
