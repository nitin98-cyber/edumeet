// ========================================
// Bulk Upload JavaScript
// ========================================

let studentData = [];
let facultyData = [];

// Switch upload tabs
function switchUploadTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}UploadTab`).classList.add('active');
}

// Download Student Template
function downloadStudentTemplate() {
    const csv = `name,email,roll_number,department,section,course,phone,password
John Doe,john@example.com,CS001,Computer Science,A,B.Tech,1234567890,password123
Jane Smith,jane@example.com,CS002,Computer Science,A,B.Tech,0987654321,password123`;
    
    downloadCSV(csv, 'student_template.csv');
    showAlert('Student template downloaded!', 'success');
}

// Download Faculty Template
function downloadFacultyTemplate() {
    const csv = `name,email,department,designation,course,phone,password
Dr. John Smith,drjohn@example.com,Computer Science,Professor,Data Structures,1234567890,password123
Dr. Jane Doe,drjane@example.com,Information Technology,Associate Professor,Algorithms,0987654321,password123`;
    
    downloadCSV(csv, 'faculty_template.csv');
    showAlert('Faculty template downloaded!', 'success');
}

// Download CSV helper
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Handle Student File
function handleStudentFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showAlert('Please select a CSV file', 'danger');
        return;
    }
    
    document.getElementById('studentFileName').textContent = `Selected: ${file.name}`;
    document.getElementById('studentFileName').classList.add('show');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        studentData = parseCSV(text);
        displayStudentPreview(studentData);
    };
    reader.readAsText(file);
}

// Handle Faculty File
function handleFacultyFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showAlert('Please select a CSV file', 'danger');
        return;
    }
    
    document.getElementById('facultyFileName').textContent = `Selected: ${file.name}`;
    document.getElementById('facultyFileName').classList.add('show');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        facultyData = parseCSV(text);
        displayFacultyPreview(facultyData);
    };
    reader.readAsText(file);
}

// Parse CSV
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return data;
}

// Display Student Preview
function displayStudentPreview(data) {
    if (data.length === 0) {
        showAlert('No valid data found in CSV', 'warning');
        return;
    }
    
    const previewSection = document.getElementById('studentPreviewSection');
    const previewDiv = document.getElementById('studentPreview');
    
    let html = `
        <p style="color: var(--text-secondary); margin-bottom: 15px;">
            Found ${data.length} student(s) in the file. Review the data below:
        </p>
        <div class="preview-table">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Section</th>
                        <th>Course</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.slice(0, 10).forEach(student => {
        html += `
            <tr>
                <td>${student.name || '-'}</td>
                <td>${student.email || '-'}</td>
                <td>${student.roll_number || '-'}</td>
                <td>${student.department || '-'}</td>
                <td>${student.section || '-'}</td>
                <td>${student.course || '-'}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    if (data.length > 10) {
        html += `<p style="color: var(--text-secondary); margin-top: 10px; font-style: italic;">
            Showing first 10 of ${data.length} students
        </p>`;
    }
    
    previewDiv.innerHTML = html;
    previewSection.style.display = 'block';
}

// Display Faculty Preview
function displayFacultyPreview(data) {
    if (data.length === 0) {
        showAlert('No valid data found in CSV', 'warning');
        return;
    }
    
    const previewSection = document.getElementById('facultyPreviewSection');
    const previewDiv = document.getElementById('facultyPreview');
    
    let html = `
        <p style="color: var(--text-secondary); margin-bottom: 15px;">
            Found ${data.length} faculty member(s) in the file. Review the data below:
        </p>
        <div class="preview-table">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Course</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.slice(0, 10).forEach(faculty => {
        html += `
            <tr>
                <td>${faculty.name || '-'}</td>
                <td>${faculty.email || '-'}</td>
                <td>${faculty.department || '-'}</td>
                <td>${faculty.designation || '-'}</td>
                <td>${faculty.course || '-'}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    if (data.length > 10) {
        html += `<p style="color: var(--text-secondary); margin-top: 10px; font-style: italic;">
            Showing first 10 of ${data.length} faculty members
        </p>`;
    }
    
    previewDiv.innerHTML = html;
    previewSection.style.display = 'block';
}

// Upload Students
async function uploadStudents() {
    if (studentData.length === 0) {
        showAlert('No data to upload', 'warning');
        return;
    }
    
    try {
        showAlert('Uploading students...', 'info');
        
        const response = await fetch('/api/admin/students/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayStudentResults(result);
            showAlert(`Successfully uploaded ${result.successful} student(s)!`, 'success');
        } else {
            showAlert(result.message || 'Upload failed', 'danger');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Error uploading students', 'danger');
    }
}

// Upload Faculty
async function uploadFaculty() {
    if (facultyData.length === 0) {
        showAlert('No data to upload', 'warning');
        return;
    }
    
    try {
        showAlert('Uploading faculty...', 'info');
        
        const response = await fetch('/api/admin/faculty/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ faculty: facultyData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayFacultyResults(result);
            showAlert(`Successfully uploaded ${result.successful} faculty member(s)!`, 'success');
        } else {
            showAlert(result.message || 'Upload failed', 'danger');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Error uploading faculty', 'danger');
    }
}

// Display Student Results
function displayStudentResults(result) {
    const resultsSection = document.getElementById('studentResultsSection');
    const resultsDiv = document.getElementById('studentResults');
    
    let html = `
        <div class="result-summary">
            <div class="result-card success">
                <h3>${result.successful}</h3>
                <p>Successful</p>
            </div>
            <div class="result-card error">
                <h3>${result.failed}</h3>
                <p>Failed</p>
            </div>
        </div>
    `;
    
    if (result.errors && result.errors.length > 0) {
        html += `
            <div style="margin-top: 20px;">
                <h4 style="color: var(--danger); margin-bottom: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> Errors
                </h4>
                <div style="max-height: 300px; overflow-y: auto;">
        `;
        
        result.errors.forEach(error => {
            html += `
                <div style="padding: 10px; margin-bottom: 10px; background: rgba(var(--danger-rgb, 248, 113, 113), 0.1); border-left: 3px solid var(--danger); border-radius: 5px;">
                    <strong>Row ${error.row}:</strong> ${error.message}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    resultsDiv.innerHTML = html;
    resultsSection.style.display = 'block';
    
    // Hide preview section
    document.getElementById('studentPreviewSection').style.display = 'none';
}

// Display Faculty Results
function displayFacultyResults(result) {
    const resultsSection = document.getElementById('facultyResultsSection');
    const resultsDiv = document.getElementById('facultyResults');
    
    let html = `
        <div class="result-summary">
            <div class="result-card success">
                <h3>${result.successful}</h3>
                <p>Successful</p>
            </div>
            <div class="result-card error">
                <h3>${result.failed}</h3>
                <p>Failed</p>
            </div>
        </div>
    `;
    
    if (result.errors && result.errors.length > 0) {
        html += `
            <div style="margin-top: 20px;">
                <h4 style="color: var(--danger); margin-bottom: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> Errors
                </h4>
                <div style="max-height: 300px; overflow-y: auto;">
        `;
        
        result.errors.forEach(error => {
            html += `
                <div style="padding: 10px; margin-bottom: 10px; background: rgba(var(--danger-rgb, 248, 113, 113), 0.1); border-left: 3px solid var(--danger); border-radius: 5px;">
                    <strong>Row ${error.row}:</strong> ${error.message}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    resultsDiv.innerHTML = html;
    resultsSection.style.display = 'block';
    
    // Hide preview section
    document.getElementById('facultyPreviewSection').style.display = 'none';
}

// Cancel Student Upload
function cancelStudentUpload() {
    document.getElementById('studentFile').value = '';
    document.getElementById('studentFileName').classList.remove('show');
    document.getElementById('studentPreviewSection').style.display = 'none';
    document.getElementById('studentResultsSection').style.display = 'none';
    studentData = [];
}

// Cancel Faculty Upload
function cancelFacultyUpload() {
    document.getElementById('facultyFile').value = '';
    document.getElementById('facultyFileName').classList.remove('show');
    document.getElementById('facultyPreviewSection').style.display = 'none';
    document.getElementById('facultyResultsSection').style.display = 'none';
    facultyData = [];
}

// Drag and drop support
['studentFileArea', 'facultyFileArea'].forEach(areaId => {
    const area = document.getElementById(areaId);
    if (!area) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        area.addEventListener(eventName, () => area.classList.add('dragover'), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, () => area.classList.remove('dragover'), false);
    });
    
    area.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (areaId === 'studentFileArea') {
            document.getElementById('studentFile').files = files;
            handleStudentFile({ target: { files: files } });
        } else {
            document.getElementById('facultyFile').files = files;
            handleFacultyFile({ target: { files: files } });
        }
    }, false);
});
