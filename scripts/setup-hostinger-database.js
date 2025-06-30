const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function setupHostingerDatabase() {
  let connection

  try {
    console.log("🚀 Setting up Hostinger database...")

    const dbConfig = {
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: false, // Hostinger doesn't support SSL on shared hosting
      multipleStatements: true, // Allow multiple statements for setup
    }

    console.log("🔗 Connecting to Hostinger database:", {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
    })

    connection = await mysql.createConnection(dbConfig)

    // Test connection
    await connection.execute("SELECT 1 as test")
    console.log("✅ Connected to Hostinger database")

    // Create tables
    console.log("📋 Creating database tables...")

    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(191) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('STUDENT','TRAINER','ADMIN') NOT NULL,
        full_name VARCHAR(191),
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // OTPs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(191) NOT NULL,
        otp_code CHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_email_otp (email, otp_code),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // User sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        session_token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_user_id (user_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Batches table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS batches (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(191) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_active (is_active),
        INDEX idx_dates (start_date, end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Courses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(191) NOT NULL,
        description TEXT,
        trainer_id INT NOT NULL,
        batch_id INT NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_trainer (trainer_id),
        INDEX idx_batch (batch_id),
        INDEX idx_published (is_published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Enrollments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        batch_id INT NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE KEY unique_enrollment (student_id, batch_id),
        INDEX idx_student (student_id),
        INDEX idx_batch (batch_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Videos table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(191) NOT NULL,
        description TEXT,
        ftp_path VARCHAR(255) NOT NULL,
        duration_seconds INT DEFAULT 0,
        order_index INT DEFAULT 0,
        md5 CHAR(32) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_course (course_id),
        INDEX idx_order (course_id, order_index),
        INDEX idx_md5 (md5)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Video progress table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS video_progress (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        video_id INT NOT NULL,
        progress_seconds INT DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        last_watched_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY unique_progress (user_id, video_id),
        INDEX idx_user (user_id),
        INDEX idx_video (video_id),
        INDEX idx_completed (completed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // FTP transfer logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ftp_transfer_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        trainer_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        bytes_total BIGINT DEFAULT 0,
        md5 CHAR(32),
        status ENUM('SUCCESS','FAILED') NOT NULL,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_trainer (trainer_id),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Storage metrics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS storage_metrics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        bytes_used BIGINT NOT NULL,
        collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_collected (collected_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log("✅ All tables created successfully!")

    // Show created tables
    const [tables] = await connection.execute("SHOW TABLES")
    console.log("📋 Created tables:", tables)
  } catch (error) {
    console.error("❌ Error setting up Hostinger database:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Database connection closed")
    }
  }
}

// Run setup
setupHostingerDatabase().catch(console.error)
