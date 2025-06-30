-- Seed Data for Video Learning Platform

-- Insert Admin User (password: admin123)
-- Salt: randomly generated 16-byte salt (hex representation)
-- MD5 hash of salt + password
INSERT INTO users (email, salt, md5_hash, role, full_name, is_active) VALUES
('admin@platform.com', UNHEX('1234567890ABCDEF1234567890ABCDEF'), MD5(CONCAT(UNHEX('1234567890ABCDEF1234567890ABCDEF'), 'admin123')), 'ADMIN', 'System Administrator', TRUE);

-- Insert Sample Trainer (password: trainer123)
INSERT INTO users (email, salt, md5_hash, role, full_name, is_active) VALUES
('trainer@platform.com', UNHEX('FEDCBA0987654321FEDCBA0987654321'), MD5(CONCAT(UNHEX('FEDCBA0987654321FEDCBA0987654321'), 'trainer123')), 'TRAINER', 'John Trainer', TRUE);

-- Insert Sample Students (password: student123)
INSERT INTO users (email, salt, md5_hash, role, full_name, is_active) VALUES
('student1@platform.com', UNHEX('ABCDEF1234567890ABCDEF1234567890'), MD5(CONCAT(UNHEX('ABCDEF1234567890ABCDEF1234567890'), 'student123')), 'STUDENT', 'Alice Student', TRUE),
('student2@platform.com', UNHEX('9876543210FEDCBA9876543210FEDCBA'), MD5(CONCAT(UNHEX('9876543210FEDCBA9876543210FEDCBA'), 'student123')), 'STUDENT', 'Bob Student', TRUE);

-- Insert Sample Batches
INSERT INTO batches (name, description, start_date, end_date, is_active) VALUES
('Web Development Batch 2024', 'Complete web development course covering frontend and backend technologies', '2024-01-15', '2024-06-15', TRUE),
('Data Science Batch 2024', 'Comprehensive data science program with Python and machine learning', '2024-02-01', '2024-07-01', TRUE),
('Mobile App Development', 'React Native and Flutter mobile development course', '2024-03-01', '2024-08-01', TRUE);

-- Insert Sample Courses
INSERT INTO courses (title, description, trainer_id, batch_id, is_published) VALUES
('HTML & CSS Fundamentals', 'Learn the basics of web development with HTML and CSS', 2, 1, TRUE),
('JavaScript Essentials', 'Master JavaScript programming from basics to advanced concepts', 2, 1, TRUE),
('React.js Complete Guide', 'Build modern web applications with React.js', 2, 1, TRUE),
('Python for Data Science', 'Introduction to Python programming for data analysis', 2, 2, TRUE),
('Machine Learning Basics', 'Fundamentals of machine learning algorithms and applications', 2, 2, FALSE);

-- Insert Sample Enrollments
INSERT INTO enrollments (student_id, batch_id) VALUES
(3, 1), -- Alice in Web Development
(4, 1), -- Bob in Web Development
(3, 2), -- Alice in Data Science
(4, 2); -- Bob in Data Science

-- Insert Sample Videos (Note: These would be actual FTPS paths in production)
INSERT INTO videos (course_id, title, description, ftp_path, duration_seconds, order_index, md5) VALUES
-- HTML & CSS Course
(1, 'Introduction to HTML', 'Basic HTML structure and elements', '/videos/html-css/01-intro-html.mp4', 1800, 1, MD5('sample-video-content-1')),
(1, 'CSS Styling Basics', 'Learn CSS selectors and properties', '/videos/html-css/02-css-basics.mp4', 2100, 2, MD5('sample-video-content-2')),
(1, 'Responsive Design', 'Creating responsive layouts with CSS', '/videos/html-css/03-responsive.mp4', 2400, 3, MD5('sample-video-content-3')),

-- JavaScript Course
(2, 'JavaScript Variables and Data Types', 'Understanding JavaScript fundamentals', '/videos/javascript/01-variables.mp4', 1950, 1, MD5('sample-video-content-4')),
(2, 'Functions and Scope', 'Working with JavaScript functions', '/videos/javascript/02-functions.mp4', 2250, 2, MD5('sample-video-content-5')),
(2, 'DOM Manipulation', 'Interacting with the Document Object Model', '/videos/javascript/03-dom.mp4', 2700, 3, MD5('sample-video-content-6')),

-- React Course
(3, 'React Components', 'Building reusable React components', '/videos/react/01-components.mp4', 2100, 1, MD5('sample-video-content-7')),
(3, 'State and Props', 'Managing component state and props', '/videos/react/02-state-props.mp4', 2400, 2, MD5('sample-video-content-8')),

-- Python Course
(4, 'Python Basics', 'Introduction to Python programming', '/videos/python/01-basics.mp4', 1800, 1, MD5('sample-video-content-9')),
(4, 'Data Structures in Python', 'Lists, dictionaries, and sets', '/videos/python/02-data-structures.mp4', 2200, 2, MD5('sample-video-content-10'));

-- Insert Sample Video Progress
INSERT INTO video_progress (user_id, video_id, progress_seconds, completed) VALUES
-- Alice's progress
(3, 1, 1800, TRUE),  -- Completed HTML intro
(3, 2, 1200, FALSE), -- Partially watched CSS basics
(3, 4, 900, FALSE),  -- Started JavaScript variables

-- Bob's progress
(4, 1, 1800, TRUE),  -- Completed HTML intro
(4, 2, 2100, TRUE),  -- Completed CSS basics
(4, 3, 800, FALSE);  -- Started responsive design

-- Insert Sample Storage Metrics
INSERT INTO storage_metrics (bytes_used) VALUES
(1073741824), -- 1GB used
(2147483648), -- 2GB used
(3221225472); -- 3GB used

-- Insert Sample FTP Transfer Logs
INSERT INTO ftp_transfer_logs (trainer_id, file_name, bytes_total, md5, status, message) VALUES
(2, 'intro-html.mp4', 52428800, MD5('sample-video-content-1'), 'SUCCESS', 'File uploaded successfully'),
(2, 'css-basics.mp4', 62914560, MD5('sample-video-content-2'), 'SUCCESS', 'File uploaded successfully'),
(2, 'responsive.mp4', 71303168, MD5('sample-video-content-3'), 'SUCCESS', 'File uploaded successfully');
