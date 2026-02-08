// ========================================
// Admin Dashboard JavaScript
// ========================================

let currentTab = 'students';

// Load dashboard data
async function loadDashboard() {
    try {
        console.log('Loading dashboard data...');
        const response = await fetch('/api/admin/dashboard');
        console.log('Dashboard response status:', response.status);
        const data = await response.json();
        console.log('Dashboard data:', data);
        
        if (data.success) {
            updateStatistics(data.stats);
            createCharts(data.stats, data.trends);
            loadStudents();
        } else {
            console.error('Dashboard load failed:', data.message);
            showAlert('Failed to load dashboard data: ' + (data.message || 'Unknown error'), 'danger');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard: ' + error.message, 'danger');
    }
}

// Update statistics
function updateStatistics(stats) {
    // Get elements and animate
    const studentsEl = document.getElementById('totalStudents');
    const facultyEl = document.getElementById('totalFaculty');
    const appointmentsEl = document.getElementById('totalAppointments');
    const pendingEl = document.getElementById('pendingRequests');
    
    if (studentsEl) animateValue(studentsEl, 0, stats.students || 0, 2000);
    if (facultyEl) animateValue(facultyEl, 0, stats.faculty || 0, 2000);
    if (appointmentsEl) animateValue(appointmentsEl, 0, stats.appointments || 0, 2000);
    if (pendingEl) animateValue(pendingEl, 0, stats.pending || 0, 2000);
    
    // Update progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.stat-progress-bar');
        progressBars.forEach(bar => {
            if (bar) bar.style.width = '100%';
        });
    }, 500);
}

// Create charts
function createCharts(stats, trends) {
    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        new Chart(statusCtx, {
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
    
    // Trends Chart
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx && trends) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: trends.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Appointments',
                    data: trends.data || [12, 19, 15, 25, 22, 18, 20],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Switch tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    // Load data for the tab
    if (tab === 'students') loadStudents();
    else if (tab === 'faculty') loadFaculty();
    else if (tab === 'appointments') loadAppointments();
}

// Load students
async function loadStudents() {
    const container = document.getElementById('studentsContainer');
    container.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/admin/students');
        const data = await response.json();
        
        if (data.success) {
            displayStudents(data.students);
        } else {
            container.innerHTML = '<div class="empty-state"><p>Failed to load students</p></div>';
        }
    } catch (error) {
        console.error('Error loading students:', error);
        container.innerHTML = '<div class="empty-state"><p>Error loading students</p></div>';
    }
}

// Display students
function displayStudents(students) {
    displayStudentsWithCheckboxes(students);
}

// Load faculty
async function loadFaculty() {
    const container = document.getElementById('facultyContainer');
    container.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/admin/faculty');
        const data = await response.json();
        
        if (data.success) {
            displayFaculty(data.faculty);
        } else {
            container.innerHTML = '<div class="empty-state"><p>Failed to load faculty</p></div>';
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
        container.innerHTML = '<div class="empty-state"><p>Error loading faculty</p></div>';
    }
}

// Display faculty
function displayFaculty(faculty) {
    displayFacultyWithCheckboxes(faculty);
}

// Load appointments
async function loadAppointments() {
    const container = document.getElementById('appointmentsContainer');
    container.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
    
    try {
        console.log('Loading appointments...');
        const response = await fetch('/api/admin/appointments');
        console.log('Appointments response status:', response.status);
        const data = await response.json();
        console.log('Appointments data:', data);
        
        if (data.success) {
            displayAppointments(data.appointments);
        } else {
            console.error('Appointments load failed:', data.message);
            container.innerHTML = `<div class="empty-state"><p>Failed to load appointments: ${data.message || 'Unknown error'}</p></div>`;
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        container.innerHTML = `<div class="empty-state"><p>Error loading appointments: ${error.message}</p></div>`;
    }
}

// Display appointments
function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsContainer');
    
    if (!appointments || appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments found</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Faculty</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(apt => `
                        <tr class="animate-fade-in">
                            <td>${apt.student_name}</td>
                            <td>${apt.faculty_name}</td>
                            <td>${formatDate(apt.date)}</td>
                            <td>${formatTime(apt.start_time)}</td>
                            <td><span class="badge badge-${getStatusClass(apt.status)}">${apt.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Modal functions
function openAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'flex';
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
}

function openAddFacultyModal() {
    document.getElementById('addFacultyModal').style.display = 'flex';
}

function closeAddFacultyModal() {
    document.getElementById('addFacultyModal').style.display = 'none';
    document.getElementById('addFacultyForm').reset();
}

// Add student
async function addStudent() {
    const formData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        rollNumber: document.getElementById('studentRoll').value,
        department: document.getElementById('studentDept').value,
        section: document.getElementById('studentSection').value,
        course: document.getElementById('studentCourse').value,
        phone: document.getElementById('studentPhone').value,
        password: document.getElementById('studentPassword').value
    };
    
    if (!formData.name || !formData.email || !formData.rollNumber || !formData.department || !formData.section || !formData.course || !formData.password) {
        showAlert('Please fill all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Student added successfully', 'success');
            closeAddStudentModal();
            loadStudents();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to add student', 'danger');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showAlert('Error adding student', 'danger');
    }
}

// Add faculty
async function addFaculty() {
    const formData = {
        name: document.getElementById('facultyName').value,
        email: document.getElementById('facultyEmail').value,
        department: document.getElementById('facultyDept').value,
        designation: document.getElementById('facultyDesignation').value,
        course: document.getElementById('facultyCourse').value,
        phone: document.getElementById('facultyPhone').value,
        password: document.getElementById('facultyPassword').value
    };
    
    if (!formData.name || !formData.email || !formData.department || !formData.designation || !formData.course || !formData.password) {
        showAlert('Please fill all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/faculty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Faculty added successfully', 'success');
            closeAddFacultyModal();
            loadFaculty();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to add faculty', 'danger');
        }
    } catch (error) {
        console.error('Error adding faculty:', error);
        showAlert('Error adding faculty', 'danger');
    }
}

// Delete student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`/api/admin/students/${studentId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Student deleted successfully', 'success');
            loadStudents();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to delete student', 'danger');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showAlert('Error deleting student', 'danger');
    }
}

// Delete faculty
async function deleteFaculty(facultyId) {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    
    try {
        const response = await fetch(`/api/admin/faculty/${facultyId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Faculty deleted successfully', 'success');
            loadFaculty();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to delete faculty', 'danger');
        }
    } catch (error) {
        console.error('Error deleting faculty:', error);
        showAlert('Error deleting faculty', 'danger');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

// Export students as CSV
function exportStudents() {
    window.location.href = '/api/admin/export/students';
    showAlert('Downloading students list...', 'success');
}

// Export faculty as CSV
function exportFaculty() {
    window.location.href = '/api/admin/export/faculty';
    showAlert('Downloading faculty list...', 'success');
}

// Bulk delete students
let selectedStudents = [];

function toggleStudentSelection(studentId) {
    const index = selectedStudents.indexOf(studentId);
    if (index > -1) {
        selectedStudents.splice(index, 1);
    } else {
        selectedStudents.push(studentId);
    }
    
    // Show/hide bulk delete button
    const bulkBtn = document.getElementById('bulkDeleteStudentsBtn');
    if (bulkBtn) {
        bulkBtn.style.display = selectedStudents.length > 0 ? 'inline-block' : 'none';
    }
}

async function bulkDeleteStudents() {
    if (selectedStudents.length === 0) {
        showAlert('No students selected', 'warning');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) return;
    
    try {
        const response = await fetch('/api/admin/students/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentIds: selectedStudents })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            selectedStudents = [];
            loadStudents();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to delete students', 'danger');
        }
    } catch (error) {
        console.error('Error bulk deleting students:', error);
        showAlert('Error deleting students', 'danger');
    }
}

// Bulk delete faculty
let selectedFaculty = [];

function toggleFacultySelection(facultyId) {
    const index = selectedFaculty.indexOf(facultyId);
    if (index > -1) {
        selectedFaculty.splice(index, 1);
    } else {
        selectedFaculty.push(facultyId);
    }
    
    // Show/hide bulk delete button
    const bulkBtn = document.getElementById('bulkDeleteFacultyBtn');
    if (bulkBtn) {
        bulkBtn.style.display = selectedFaculty.length > 0 ? 'inline-block' : 'none';
    }
}

async function bulkDeleteFaculty() {
    if (selectedFaculty.length === 0) {
        showAlert('No faculty selected', 'warning');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedFaculty.length} faculty member(s)?`)) return;
    
    try {
        const response = await fetch('/api/admin/faculty/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ facultyIds: selectedFaculty })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            selectedFaculty = [];
            loadFaculty();
            loadDashboard();
        } else {
            showAlert(data.message || 'Failed to delete faculty', 'danger');
        }
    } catch (error) {
        console.error('Error bulk deleting faculty:', error);
        showAlert('Error deleting faculty', 'danger');
    }
}

// Update displayStudents to include checkboxes
function displayStudentsWithCheckboxes(students) {
    const container = document.getElementById('studentsContainer');
    
    if (!students || students.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-graduate"></i>
                <p>No students found</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleAllStudents(this)"></th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr class="animate-fade-in">
                            <td><input type="checkbox" onchange="toggleStudentSelection(${student.student_id})" ${selectedStudents.includes(student.student_id) ? 'checked' : ''}></td>
                            <td>${student.name}</td>
                            <td>${student.roll_number}</td>
                            <td>${student.department}</td>
                            <td>${student.email}</td>
                            <td>${student.phone || 'N/A'}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.student_id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Update displayFaculty to include checkboxes
function displayFacultyWithCheckboxes(faculty) {
    const container = document.getElementById('facultyContainer');
    
    if (!faculty || faculty.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chalkboard-teacher"></i>
                <p>No faculty found</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onchange="toggleAllFaculty(this)"></th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${faculty.map(fac => `
                        <tr class="animate-fade-in">
                            <td><input type="checkbox" onchange="toggleFacultySelection(${fac.faculty_id})" ${selectedFaculty.includes(fac.faculty_id) ? 'checked' : ''}></td>
                            <td>${fac.name}</td>
                            <td>${fac.department}</td>
                            <td>${fac.designation}</td>
                            <td>${fac.email}</td>
                            <td>${fac.phone || 'N/A'}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteFaculty(${fac.faculty_id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Toggle all students
function toggleAllStudents(checkbox) {
    const checkboxes = document.querySelectorAll('#studentsContainer input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = checkbox.checked;
            const studentId = parseInt(cb.getAttribute('onchange').match(/\d+/)[0]);
            if (checkbox.checked && !selectedStudents.includes(studentId)) {
                selectedStudents.push(studentId);
            } else if (!checkbox.checked) {
                const index = selectedStudents.indexOf(studentId);
                if (index > -1) selectedStudents.splice(index, 1);
            }
        }
    });
    
    const bulkBtn = document.getElementById('bulkDeleteStudentsBtn');
    if (bulkBtn) {
        bulkBtn.style.display = selectedStudents.length > 0 ? 'inline-block' : 'none';
    }
}

// Toggle all faculty
function toggleAllFaculty(checkbox) {
    const checkboxes = document.querySelectorAll('#facultyContainer input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = checkbox.checked;
            const facultyId = parseInt(cb.getAttribute('onchange').match(/\d+/)[0]);
            if (checkbox.checked && !selectedFaculty.includes(facultyId)) {
                selectedFaculty.push(facultyId);
            } else if (!checkbox.checked) {
                const index = selectedFaculty.indexOf(facultyId);
                if (index > -1) selectedFaculty.splice(index, 1);
            }
        }
    });
    
    const bulkBtn = document.getElementById('bulkDeleteFacultyBtn');
    if (bulkBtn) {
        bulkBtn.style.display = selectedFaculty.length > 0 ? 'inline-block' : 'none';
    }
}
