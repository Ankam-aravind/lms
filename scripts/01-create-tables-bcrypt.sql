-- Video Learning Platform Database Schema with bcrypt
-- MySQL 8.0 Compatible

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS ftp_transfer_logs;
DROP TABLE IF EXISTS storage_metrics;
DROP TABLE IF EXISTS video_progress;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS batches;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS users;

-- Users & Authentication Tables (Updated for bcrypt)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Changed from salt/md5_hash to bcrypt hash
  role ENUM('STUDENT','TRAINER','ADMIN') NOT NULL,
  full_name VARCHAR(191),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);

CREATE TABLE otps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  otp_code CHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email_otp (email, otp_code),
  INDEX idx_expires (expires_at)
);

CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_token TEXT NOT NULL, -- Changed to TEXT for JWT tokens
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
);

-- Learning Management Tables
CREATE TABLE batches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_active (is_active),
  INDEX idx_dates (start_date, end_date)
);

CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(191) NOT NULL,
  description TEXT,
  trainer_id INT NOT NULL,
  batch_id INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  INDEX idx_trainer (trainer_id),
  INDEX idx_batch (batch_id),
  INDEX idx_published (is_published)
);

CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  batch_id INT NOT NULL,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, batch_id),
  INDEX idx_student (student_id),
  INDEX idx_batch (batch_id)
);

CREATE TABLE videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT,
  ftp_path VARCHAR(255) NOT NULL,
  duration_seconds INT DEFAULT 0,
  order_index INT DEFAULT 0,
  md5 CHAR(32) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course (course_id),
  INDEX idx_order (course_id, order_index),
  INDEX idx_md5 (md5)
);

CREATE TABLE video_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  progress_seconds INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (user_id, video_id),
  INDEX idx_user (user_id),
  INDEX idx_video (video_id),
  INDEX idx_completed (completed)
);

-- Operations & Metrics Tables
CREATE TABLE ftp_transfer_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trainer_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  bytes_total BIGINT DEFAULT 0,
  md5 CHAR(32),
  status ENUM('SUCCESS','FAILED') NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_trainer (trainer_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

CREATE TABLE storage_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bytes_used BIGINT NOT NULL,
  collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_collected (collected_at)
);
