-- ========================================
-- New Features Database Schema
-- ========================================

-- 3. Add department and expertise fields to users table (if not exists)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS expertise TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_ratings INT DEFAULT 0;

-- 1. Rating System - Add ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking_rating (booking_id),
    INDEX idx_student (student_id),
    INDEX idx_faculty (faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Favorite Faculty - Add favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    faculty_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (student_id, faculty_id),
    INDEX idx_student_fav (student_id),
    INDEX idx_faculty_fav (faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
