-- ========================================
-- Update Database Schema
-- Add Section and Course fields
-- ========================================

-- Add section and course to students table
ALTER TABLE students 
ADD COLUMN section VARCHAR(10) AFTER department,
ADD COLUMN course VARCHAR(100) AFTER section;

-- Add course to faculty table
ALTER TABLE faculty 
ADD COLUMN course VARCHAR(100) AFTER designation;

-- Update existing students with default values
UPDATE students SET section = 'A', course = 'Computer Science' WHERE section IS NULL;

-- Update existing faculty with default values
UPDATE faculty SET course = 'Computer Science' WHERE course IS NULL;

-- Display updated structure
DESCRIBE students;
DESCRIBE faculty;

SELECT 'Database schema updated successfully!' AS message;
