const bcrypt = require("bcryptjs")
const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function seedHostingerDatabase() {
  let connection

  try {
    console.log("🌱 Seeding Hostinger database...")

    const dbConfig = {
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: false,
    }

    connection = await mysql.createConnection(dbConfig)
    console.log("✅ Connected to Hostinger database")

    // Hash passwords for test users
    console.log("🔐 Hashing passwords...")
    const studentPassword = await bcrypt.hash("password123", 12)
    const adminPassword = await bcrypt.hash("admin123", 12)
    const trainerPassword = await bcrypt.hash("trainer123", 12)

    // Insert test users
    console.log("👥 Creating test users...")
    await connection.execute(
      `INSERT IGNORE INTO users (email, password_hash, role, full_name, is_active) VALUES 
       (?, ?, 'STUDENT', 'Test Student', TRUE),
       (?, ?, 'ADMIN', 'Admin User', TRUE),
       (?, ?, 'TRAINER', 'Trainer User', TRUE)`,
      [
        "student@example.com",
        studentPassword,
        "admin@example.com",
        adminPassword,
        "trainer@example.com",
        trainerPassword,
      ],
    )

    // Insert sample batches
    console.log("📚 Creating sample batches...")
    await connection.execute(
      `INSERT IGNORE INTO batches (name, description, start_date, end_date, is_active) VALUES 
       ('Web Development 2024', 'Complete web development course', '2024-01-15', '2024-06-15', TRUE),
       ('Data Science 2024', 'Data science with Python and ML', '2024-02-01', '2024-07-01', TRUE)`,
    )

    // Get trainer and batch IDs
    const [trainers] = await connection.execute("SELECT id FROM users WHERE role = 'TRAINER' LIMIT 1")
    const [batches] = await connection.execute("SELECT id FROM batches LIMIT 2")

    if (trainers.length > 0 && batches.length > 0) {
      const trainerId = trainers[0].id
      const batchId1 = batches[0].id
      const batchId2 = batches.length > 1 ? batches[1].id : batchId1

      // Insert sample courses
      console.log("🎓 Creating sample courses...")
      await connection.execute(
        `INSERT IGNORE INTO courses (title, description, trainer_id, batch_id, is_published) VALUES 
         ('HTML & CSS Fundamentals', 'Learn web development basics', ?, ?, TRUE),
         ('JavaScript Essentials', 'Master JavaScript programming', ?, ?, TRUE),
         ('Python for Data Science', 'Data analysis with Python', ?, ?, TRUE)`,
        [trainerId, batchId1, trainerId, batchId1, trainerId, batchId2],
      )
    }

    console.log("✅ Hostinger database seeded successfully!")
    console.log("📧 Test credentials:")
    console.log("   Student: student@example.com / password123")
    console.log("   Admin: admin@example.com / admin123")
    console.log("   Trainer: trainer@example.com / trainer123")
  } catch (error) {
    console.error("❌ Error seeding Hostinger database:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Database connection closed")
    }
  }
}

// Run seeding
seedHostingerDatabase().catch(console.error)
