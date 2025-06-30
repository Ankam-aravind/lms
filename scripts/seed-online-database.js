const bcrypt = require("bcryptjs")
const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function seedOnlineDatabase() {
  let connection

  try {
    console.log("🌱 Starting online database seeding...")

    // Parse DATABASE_URL or use individual env vars
    const dbConfig = process.env.DATABASE_URL
      ? parseDatabaseUrl(process.env.DATABASE_URL)
      : {
          host: process.env.DATABASE_HOST,
          port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
        }

    console.log("🔗 Connecting to:", {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      ssl: !!dbConfig.ssl,
    })

    connection = await mysql.createConnection(dbConfig)

    // Test connection
    await connection.ping()
    console.log("✅ Connected to online database")

    // Hash passwords for test users
    console.log("🔐 Hashing passwords...")
    const studentPassword = await bcrypt.hash("password123", 12)
    const adminPassword = await bcrypt.hash("admin123", 12)
    const trainerPassword = await bcrypt.hash("trainer123", 12)

    // Insert test users
    console.log("👥 Creating test users...")
    await connection.execute(
      `INSERT INTO users (email, password_hash, role, full_name, is_active) VALUES 
       (?, ?, 'STUDENT', 'Test Student', TRUE),
       (?, ?, 'ADMIN', 'Admin User', TRUE),
       (?, ?, 'TRAINER', 'Trainer User', TRUE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
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
      `INSERT INTO batches (name, description, start_date, end_date, is_active) VALUES 
       ('Web Development 2024', 'Complete web development course', '2024-01-15', '2024-06-15', TRUE),
       ('Data Science 2024', 'Data science with Python and ML', '2024-02-01', '2024-07-01', TRUE)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    )

    // Get user and batch IDs for courses
    const [users] = await connection.execute("SELECT id, role FROM users WHERE role = 'TRAINER' LIMIT 1")
    const [batches] = await connection.execute("SELECT id FROM batches LIMIT 2")

    if (users.length > 0 && batches.length > 0) {
      const trainerId = users[0].id
      const batchId1 = batches[0].id
      const batchId2 = batches.length > 1 ? batches[1].id : batchId1

      // Insert sample courses
      console.log("🎓 Creating sample courses...")
      await connection.execute(
        `INSERT INTO courses (title, description, trainer_id, batch_id, is_published) VALUES 
         ('HTML & CSS Fundamentals', 'Learn web development basics', ?, ?, TRUE),
         ('JavaScript Essentials', 'Master JavaScript programming', ?, ?, TRUE),
         ('Python for Data Science', 'Data analysis with Python', ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [trainerId, batchId1, trainerId, batchId1, trainerId, batchId2],
      )
    }

    console.log("✅ Online database seeded successfully!")
    console.log("📧 Test credentials:")
    console.log("   Student: student@example.com / password123")
    console.log("   Admin: admin@example.com / admin123")
    console.log("   Trainer: trainer@example.com / trainer123")
  } catch (error) {
    console.error("❌ Error seeding online database:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Database connection closed")
    }
  }
}

function parseDatabaseUrl(url) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number.parseInt(parsed.port) || 3306,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
  }
}

// Run seeding
seedOnlineDatabase().catch(console.error)
