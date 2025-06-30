const bcrypt = require("bcryptjs")
const mysql = require("mysql2/promise")

async function createTestUsers() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "video_learning_platform",
  })

  try {
    // Hash passwords
    const studentPassword = await bcrypt.hash("password123", 12)
    const adminPassword = await bcrypt.hash("admin123", 12)
    const trainerPassword = await bcrypt.hash("trainer123", 12)

    // Insert test users
    await connection.execute(
      `INSERT INTO users (email, password_hash, role, full_name, is_active) VALUES 
       (?, ?, 'STUDENT', 'Test Student', TRUE),
       (?, ?, 'ADMIN', 'Admin User', TRUE),
       (?, ?, 'TRAINER', 'Trainer User', TRUE)`,
      ["test@example.com", studentPassword, "admin@example.com", adminPassword, "trainer@example.com", trainerPassword],
    )

    console.log("✅ Test users created successfully!")
    console.log("📧 Test credentials:")
    console.log("   Student: test@example.com / password123")
    console.log("   Admin: admin@example.com / admin123")
    console.log("   Trainer: trainer@example.com / trainer123")
  } catch (error) {
    console.error("❌ Error creating test users:", error)
  } finally {
    await connection.end()
  }
}

createTestUsers()
