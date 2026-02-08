# 🚀 New Features Implementation Guide

## Features Being Added

1. ⭐ **Rating System** - Students can rate appointments
2. ❤️ **Favorite Faculty** - Star icon to save favorite faculty
3. 🔍 **Advanced Search** - Filter by department and expertise
4. 📝 **Appointment Notes** - Add notes to appointments

---

## 📋 Installation Steps

### Step 1: Update Database

Run the database update script:

```bash
# Windows
UPDATE_NEW_FEATURES.bat

# Or manually
node update_database_new_features.js
```

This will:
- Create `ratings` table
- Create `favorites` table
- Add `department`, `expertise`, `bio` columns to users
- Add `student_notes`, `faculty_notes` columns to bookings
- Create necessary indexes

### Step 2: Restart Server

```bash
node server.js
```

---

## 🎯 Feature Details

### 1. ⭐ Rating System

**What it does:**
- Students can rate completed appointments (1-5 stars)
- Optional written review
- Faculty average rating displayed on profile
- Ratings visible to all students

**Database:**
```sql
ratings table:
- id (primary key)
- booking_id (unique - one rating per booking)
- student_id
- faculty_id
- rating (1-5)
- review (text)
- created_at
```

**API Endpoints to Add:**

```javascript
// POST /api/ratings - Submit rating
router.post('/ratings', auth, async (req, res) => {
    const { booking_id, faculty_id, rating, review } = req.body;
    const student_id = req.user.id;
    
    // Insert rating
    // Update faculty average_rating
    // Send notification to faculty
});

// GET /api/ratings/faculty/:id - Get faculty ratings
router.get('/ratings/faculty/:id', async (req, res) => {
    // Get all ratings for faculty
    // Calculate average
    // Return ratings with student names
});

// GET /api/ratings/booking/:id - Check if rated
router.get('/ratings/booking/:id', auth, async (req, res) => {
    // Check if student already rated this booking
});
```

**Frontend UI:**

```html
<!-- Rating Modal (after appointment completion) -->
<div id="ratingModal" class="modal">
    <div class="modal-content">
        <h3>Rate Your Appointment</h3>
        <div class="star-rating">
            <i class="fas fa-star" data-rating="1"></i>
            <i class="fas fa-star" data-rating="2"></i>
            <i class="fas fa-star" data-rating="3"></i>
            <i class="fas fa-star" data-rating="4"></i>
            <i class="fas fa-star" data-rating="5"></i>
        </div>
        <textarea placeholder="Write a review (optional)"></textarea>
        <button onclick="submitRating()">Submit Rating</button>
    </div>
</div>

<!-- Display on Faculty Card -->
<div class="faculty-rating">
    <i class="fas fa-star"></i>
    <span>4.5</span>
    <small>(23 reviews)</small>
</div>
```

---

### 2. ❤️ Favorite Faculty

**What it does:**
- Students can mark faculty as favorites
- Quick access to favorite faculty
- Star icon toggles favorite status
- Favorites shown first in faculty list

**Database:**
```sql
favorites table:
- id (primary key)
- student_id
- faculty_id
- created_at
- UNIQUE(student_id, faculty_id)
```

**API Endpoints to Add:**

```javascript
// POST /api/favorites - Add favorite
router.post('/favorites', auth, async (req, res) => {
    const { faculty_id } = req.body;
    const student_id = req.user.id;
    
    // Insert favorite (ignore if exists)
});

// DELETE /api/favorites/:faculty_id - Remove favorite
router.delete('/favorites/:faculty_id', auth, async (req, res) => {
    const { faculty_id } = req.params;
    const student_id = req.user.id;
    
    // Delete favorite
});

// GET /api/favorites - Get student's favorites
router.get('/favorites', auth, async (req, res) => {
    const student_id = req.user.id;
    
    // Get all favorite faculty for student
});

// GET /api/favorites/check/:faculty_id - Check if favorited
router.get('/favorites/check/:faculty_id', auth, async (req, res) => {
    // Check if student has favorited this faculty
});
```

**Frontend UI:**

```html
<!-- Star Icon on Faculty Card -->
<button class="favorite-btn" onclick="toggleFavorite(facultyId)">
    <i class="far fa-star"></i> <!-- Empty star -->
    <i class="fas fa-star"></i> <!-- Filled star (hidden) -->
</button>

<!-- Favorites Section on Student Dashboard -->
<div class="favorites-section">
    <h3>⭐ My Favorite Faculty</h3>
    <div class="faculty-grid" id="favoriteFaculty">
        <!-- Favorite faculty cards here -->
    </div>
</div>
```

**CSS:**
```css
.favorite-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #ffd700;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;
}

.favorite-btn:hover {
    transform: scale(1.2);
    background: rgba(255, 255, 255, 0.3);
}

.favorite-btn.active .far {
    display: none;
}

.favorite-btn.active .fas {
    display: block;
}
```

---

### 3. 🔍 Advanced Search

**What it does:**
- Filter faculty by department
- Search by expertise keywords
- Filter by rating
- Sort by name, rating, department

**Database:**
```sql
users table additions:
- department VARCHAR(100)
- expertise TEXT
- bio TEXT
- average_rating DECIMAL(3,2)
- total_ratings INT
```

**API Endpoints to Add:**

```javascript
// GET /api/faculty/search - Advanced search
router.get('/faculty/search', async (req, res) => {
    const { 
        department, 
        expertise, 
        min_rating, 
        sort_by 
    } = req.query;
    
    let query = 'SELECT * FROM users WHERE role = "faculty"';
    let params = [];
    
    if (department) {
        query += ' AND department = ?';
        params.push(department);
    }
    
    if (expertise) {
        query += ' AND expertise LIKE ?';
        params.push(`%${expertise}%`);
    }
    
    if (min_rating) {
        query += ' AND average_rating >= ?';
        params.push(min_rating);
    }
    
    // Add sorting
    if (sort_by === 'rating') {
        query += ' ORDER BY average_rating DESC';
    } else if (sort_by === 'name') {
        query += ' ORDER BY name ASC';
    }
    
    // Execute query
});

// GET /api/departments - Get all departments
router.get('/departments', async (req, res) => {
    // Get unique departments
});
```

**Frontend UI:**

```html
<!-- Search Filters -->
<div class="search-filters">
    <div class="filter-group">
        <label>Department</label>
        <select id="departmentFilter" onchange="filterFaculty()">
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <!-- More options -->
        </select>
    </div>
    
    <div class="filter-group">
        <label>Expertise</label>
        <input type="text" id="expertiseSearch" 
               placeholder="e.g., Web Development"
               oninput="filterFaculty()">
    </div>
    
    <div class="filter-group">
        <label>Minimum Rating</label>
        <select id="ratingFilter" onchange="filterFaculty()">
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
        </select>
    </div>
    
    <div class="filter-group">
        <label>Sort By</label>
        <select id="sortBy" onchange="filterFaculty()">
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="department">Department</option>
        </select>
    </div>
    
    <button onclick="clearFilters()" class="btn btn-secondary">
        Clear Filters
    </button>
</div>
```

**JavaScript:**
```javascript
async function filterFaculty() {
    const department = document.getElementById('departmentFilter').value;
    const expertise = document.getElementById('expertiseSearch').value;
    const minRating = document.getElementById('ratingFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    const params = new URLSearchParams({
        department,
        expertise,
        min_rating: minRating,
        sort_by: sortBy
    });
    
    const response = await fetch(`/api/faculty/search?${params}`);
    const faculty = await response.json();
    
    displayFaculty(faculty);
}
```

---

### 4. 📝 Appointment Notes

**What it does:**
- Students can add notes when booking
- Faculty can add notes after meeting
- Notes visible to both parties
- Helps track discussion points

**Database:**
```sql
bookings table additions:
- student_notes TEXT
- faculty_notes TEXT
```

**API Endpoints to Update:**

```javascript
// POST /api/bookings - Add student_notes field
router.post('/bookings', auth, async (req, res) => {
    const { 
        slot_id, 
        reason, 
        student_notes  // NEW
    } = req.body;
    
    // Insert booking with student_notes
});

// PUT /api/bookings/:id/faculty-notes - Add faculty notes
router.put('/bookings/:id/faculty-notes', auth, async (req, res) => {
    const { faculty_notes } = req.body;
    const booking_id = req.params.id;
    
    // Update faculty_notes
});

// PUT /api/bookings/:id/student-notes - Update student notes
router.put('/bookings/:id/student-notes', auth, async (req, res) => {
    const { student_notes } = req.body;
    const booking_id = req.params.id;
    
    // Update student_notes
});
```

**Frontend UI:**

```html
<!-- Student Booking Form -->
<div class="form-group">
    <label>Reason for Appointment *</label>
    <textarea id="reason" required></textarea>
</div>

<div class="form-group">
    <label>Additional Notes (Optional)</label>
    <textarea id="studentNotes" 
              placeholder="Any specific topics or questions you want to discuss..."></textarea>
</div>

<!-- Faculty View of Booking -->
<div class="booking-notes">
    <div class="student-notes">
        <h4>Student Notes:</h4>
        <p id="studentNotesDisplay"></p>
    </div>
    
    <div class="faculty-notes">
        <h4>My Notes:</h4>
        <textarea id="facultyNotes" 
                  placeholder="Add notes about this meeting..."></textarea>
        <button onclick="saveFacultyNotes(bookingId)">
            Save Notes
        </button>
    </div>
</div>

<!-- Student View (After Appointment) -->
<div class="appointment-summary">
    <h4>Meeting Summary</h4>
    <div class="notes-section">
        <strong>Your Notes:</strong>
        <p id="yourNotes"></p>
    </div>
    <div class="notes-section">
        <strong>Faculty Notes:</strong>
        <p id="facultyNotesDisplay"></p>
    </div>
</div>
```

---

## 🎨 CSS Styling

Add to `style.css`:

```css
/* Rating Stars */
.star-rating {
    display: flex;
    gap: 0.5rem;
    font-size: 2rem;
    margin: 1rem 0;
}

.star-rating i {
    cursor: pointer;
    color: #ddd;
    transition: all 0.3s ease;
}

.star-rating i:hover,
.star-rating i.active {
    color: #ffd700;
    transform: scale(1.2);
}

/* Faculty Rating Display */
.faculty-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.faculty-rating i {
    color: #ffd700;
}

.faculty-rating span {
    font-weight: 700;
    font-size: 1.2rem;
}

/* Search Filters */
.search-filters {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    font-weight: 600;
    color: var(--text-primary);
}

.filter-group select,
.filter-group input {
    padding: 0.75rem;
    border-radius: 8px;
    border: 2px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-primary);
}

/* Notes Section */
.booking-notes {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 12px;
    margin-top: 1rem;
}

.notes-section {
    margin-bottom: 1.5rem;
}

.notes-section h4 {
    color: var(--primary);
    margin-bottom: 0.5rem;
}

.notes-section textarea {
    width: 100%;
    min-height: 100px;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-primary);
    resize: vertical;
}
```

---

## 📱 JavaScript Functions

Add to respective JS files:

```javascript
// Rating System
async function submitRating(bookingId, rating, review) {
    try {
        const response = await fetch('/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                booking_id: bookingId,
                rating,
                review
            })
        });
        
        if (response.ok) {
            showAlert('Rating submitted successfully!', 'success');
            closeRatingModal();
            loadBookings();
        }
    } catch (error) {
        showAlert('Error submitting rating', 'danger');
    }
}

// Favorite Faculty
async function toggleFavorite(facultyId) {
    const btn = event.target.closest('.favorite-btn');
    const isFavorite = btn.classList.contains('active');
    
    try {
        if (isFavorite) {
            await fetch(`/api/favorites/${facultyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            btn.classList.remove('active');
        } else {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ faculty_id: facultyId })
            });
            btn.classList.add('active');
        }
    } catch (error) {
        showAlert('Error updating favorite', 'danger');
    }
}

// Save Faculty Notes
async function saveFacultyNotes(bookingId) {
    const notes = document.getElementById('facultyNotes').value;
    
    try {
        const response = await fetch(`/api/bookings/${bookingId}/faculty-notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ faculty_notes: notes })
        });
        
        if (response.ok) {
            showAlert('Notes saved successfully!', 'success');
        }
    } catch (error) {
        showAlert('Error saving notes', 'danger');
    }
}
```

---

## ✅ Testing Checklist

### Rating System
- [ ] Student can rate completed appointment
- [ ] Cannot rate same appointment twice
- [ ] Faculty average rating updates correctly
- [ ] Ratings display on faculty profile
- [ ] Review text displays properly

### Favorite Faculty
- [ ] Star icon toggles correctly
- [ ] Favorites persist after page reload
- [ ] Favorites section shows on dashboard
- [ ] Can remove favorites
- [ ] Favorites show first in list

### Advanced Search
- [ ] Department filter works
- [ ] Expertise search works
- [ ] Rating filter works
- [ ] Sort options work
- [ ] Clear filters resets all
- [ ] No results message displays

### Appointment Notes
- [ ] Student can add notes when booking
- [ ] Faculty can add notes after meeting
- [ ] Both notes display correctly
- [ ] Notes save and persist
- [ ] Notes visible to both parties

---

## 🚀 Next Steps

1. Run `UPDATE_NEW_FEATURES.bat` to update database
2. Restart the server
3. Test each feature thoroughly
4. Update user documentation
5. Train users on new features

---

## 📞 Support

If you encounter any issues:
1. Check database connection
2. Verify all tables created
3. Check browser console for errors
4. Review server logs

---

**Congratulations! Your EduMeet system now has 4 powerful new features!** 🎉
