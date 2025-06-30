const fs = require("fs")
const path = require("path")

console.log("🗄️  Setting up database for Video Learning Platform...")

// Create SQL scripts directory if it doesn't exist
const scriptsDir = path.join(process.cwd(), "sql")
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true })
}

// Create database schema
const createTablesSQL = `-- Video Learning Platform Database Schema
-- Azure Database for MySQL Compatible

-- Create database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS video_learning_platform;
-- USE video_learning_platform;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'TRAINER', 'ADMIN') DEFAULT 'STUDENT',
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- OTP table for two-factor authentication
CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_otp (email, otp_code),
    INDEX idx_expires (expires_at)
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trainer_id INT NOT NULL,
    batch_id INT NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_hours DECIMAL(5,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    INDEX idx_trainer (trainer_id),
    INDEX idx_batch (batch_id),
    INDEX idx_published (is_published)
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    duration_seconds INT DEFAULT 0,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (order_index),
    INDEX idx_published (is_published)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_progress (progress_percentage)
);

-- Video progress table
CREATE TABLE IF NOT EXISTS video_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    video_id INT NOT NULL,
    watched_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (student_id, video_id),
    INDEX idx_student (student_id),
    INDEX idx_video (video_id),
    INDEX idx_completed (completed)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    certificate_url VARCHAR(500),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_certificate (student_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id)
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INT DEFAULT 0,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    time_limit_minutes INT DEFAULT 30,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_published (is_published)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0,
    total_questions INT NOT NULL,
    correct_answers INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    passed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_quiz (quiz_id),
    INDEX idx_passed (passed)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);

-- Insert default system settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
('platform_name', 'Video Learning Platform', 'Name of the learning platform'),
('max_video_size_mb', '500', 'Maximum video file size in MB'),
('session_timeout_hours', '12', 'User session timeout in hours'),
('otp_expiry_minutes', '10', 'OTP expiry time in minutes'),
('bcrypt_rounds', '12', 'bcrypt hashing rounds for passwords');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_courses_published_trainer ON courses(is_published, trainer_id);
CREATE INDEX IF NOT EXISTS idx_videos_course_order ON videos(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_progress ON course_enrollments(student_id, progress_percentage);

-- Views for common queries
CREATE OR REPLACE VIEW active_courses AS
SELECT 
    c.*,
    u.full_name as trainer_name,
    b.name as batch_name,
    COUNT(v.id) as video_count,
    COUNT(ce.id) as enrollment_count
FROM courses c
LEFT JOIN users u ON c.trainer_id = u.id
LEFT JOIN batches b ON c.batch_id = b.id
LEFT JOIN videos v ON c.id = v.course_id AND v.is_published = TRUE
LEFT JOIN course_enrollments ce ON c.id = ce.course_id
WHERE c.is_published = TRUE
GROUP BY c.id;

CREATE OR REPLACE VIEW student_progress AS
SELECT 
    ce.student_id,
    ce.course_id,
    c.title as course_title,
    ce.progress_percentage,
    ce.enrolled_at,
    ce.completed_at,
    COUNT(v.id) as total_videos,
    COUNT(vp.id) as watched_videos,
    COUNT(CASE WHEN vp.completed = TRUE THEN 1 END) as completed_videos
FROM course_enrollments ce
JOIN courses c ON ce.course_id = c.id
LEFT JOIN videos v ON c.id = v.course_id AND v.is_published = TRUE
LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.student_id = ce.student_id
GROUP BY ce.student_id, ce.course_id;

COMMIT;
`

// Create seed data
const seedDataSQL = `-- Seed Data for Video Learning Platform
-- Insert test data for development

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (email, password_hash, role, full_name, is_active) VALUES
('admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'ADMIN', 'System Administrator', TRUE),
('trainer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'TRAINER', 'John Smith', TRUE),
('student@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'STUDENT', 'Jane Doe', TRUE);

-- Insert default batch
INSERT IGNORE INTO batches (id, name, description, start_date, end_date, is_active) VALUES
(1, 'Web Development Batch 2024', 'Full-stack web development program', '2024-01-01', '2024-12-31', TRUE);

-- Insert sample courses
INSERT IGNORE INTO courses (title, description, trainer_id, batch_id, duration_hours, price, is_published) VALUES
('HTML & CSS Fundamentals', 'Learn the basics of web development with HTML and CSS', 2, 1, 15.5, 49.99, TRUE),
('JavaScript Essentials', 'Master JavaScript programming from basics to advanced concepts', 2, 1, 25.0, 79.99, TRUE),
('React.js Complete Guide', 'Build modern web applications with React.js', 2, 1, 35.5, 99.99, TRUE),
('Node.js Backend Development', 'Create powerful backend applications with Node.js', 2, 1, 30.0, 89.99, TRUE),
('Python for Data Science', 'Analyze data and build machine learning models with Python', 2, 1, 40.0, 119.99, TRUE);

-- Insert sample videos
INSERT IGNORE INTO videos (course_id, title, description, duration_seconds, order_index, is_published) VALUES
-- HTML & CSS Course
(1, 'Introduction to HTML', 'Learn the basics of HTML structure and elements', 1200, 1, TRUE),
(1, 'HTML Forms and Input Elements', 'Create interactive forms with HTML', 1800, 2, TRUE),
(1, 'CSS Basics and Styling', 'Style your HTML with CSS properties', 2100, 3, TRUE),
(1, 'CSS Flexbox and Grid', 'Master modern CSS layout techniques', 2400, 4, TRUE),
(1, 'Responsive Web Design', 'Create websites that work on all devices', 1900, 5, TRUE),

-- JavaScript Course
(2, 'JavaScript Fundamentals', 'Variables, functions, and basic syntax', 1500, 1, TRUE),
(2, 'DOM Manipulation', 'Interact with web pages using JavaScript', 2000, 2, TRUE),
(2, 'Asynchronous JavaScript', 'Promises, async/await, and API calls', 2200, 3, TRUE),
(2, 'ES6+ Features', 'Modern JavaScript features and syntax', 1800, 4, TRUE),
(2, 'JavaScript Projects', 'Build real-world applications', 3000, 5, TRUE),

-- React Course
(3, 'React Introduction', 'What is React and why use it?', 1400, 1, TRUE),
(3, 'Components and JSX', 'Building blocks of React applications', 2100, 2, TRUE),
(3, 'State and Props', 'Managing data in React components', 2300, 3, TRUE),
(3, 'React Hooks', 'Modern React development with hooks', 2500, 4, TRUE),
(3, 'React Router', 'Navigation in single-page applications', 1900, 5, TRUE);

-- Insert sample enrollments
INSERT IGNORE INTO course_enrollments (student_id, course_id, progress_percentage) VALUES
(3, 1, 75.0),
(3, 2, 45.0),
(3, 3, 20.0);

-- Insert sample video progress
INSERT IGNORE INTO video_progress (student_id, video_id, watched_seconds, completed) VALUES
(3, 1, 1200, TRUE),
(3, 2, 1800, TRUE),
(3, 3, 1500, FALSE),
(3, 6, 1500, TRUE),
(3, 7, 1200, FALSE);

-- Insert sample quiz
INSERT IGNORE INTO quizzes (course_id, title, description, total_questions, passing_score, time_limit_minutes, is_published) VALUES
(1, 'HTML & CSS Final Quiz', 'Test your knowledge of HTML and CSS fundamentals', 20, 70.00, 30, TRUE),
(2, 'JavaScript Basics Quiz', 'Evaluate your JavaScript programming skills', 25, 75.00, 45, TRUE);

-- Insert sample quiz attempts
INSERT IGNORE INTO quiz_attempts (student_id, quiz_id, score, total_questions, correct_answers, completed_at, passed) VALUES
(3, 1, 85.00, 20, 17, NOW(), TRUE);

COMMIT;
`

// Write SQL files
fs.writeFileSync(path.join(scriptsDir, "01-create-tables.sql"), createTablesSQL)
fs.writeFileSync(path.join(scriptsDir, "02-seed-data.sql"), seedDataSQL)

console.log("✅ Created database schema: sql/01-create-tables.sql")
console.log("✅ Created seed data: sql/02-seed-data.sql")
console.log("")
console.log("📋 Next steps:")
console.log("1. Create an Azure Database for MySQL server")
console.log("2. Update .env.local with your database credentials")
console.log("3. Run the SQL scripts in your Azure MySQL database")
console.log("4. Test the connection with: npm run test:auth")
console.log("")
console.log("🔐 Default login credentials:")
console.log("   Admin: admin@example.com / admin123")
console.log("   Trainer: trainer@example.com / trainer123")
console.log("   Student: student@example.com / password123")
