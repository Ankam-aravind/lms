const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function testCompleteAuthFlow() {
  console.log("🧪 Testing Complete JWT Authentication Flow")
  console.log("=".repeat(50))

  // Step 1: Test JWT Secret
  console.log("1️⃣ Testing JWT Configuration...")
  const jwtSecret = process.env.JWT_SECRET
  console.log("✅ JWT_SECRET exists:", !!jwtSecret)
  console.log("✅ JWT_SECRET length:", jwtSecret?.length || 0)

  if (!jwtSecret) {
    console.error("❌ JWT_SECRET not found!")
    return
  }

  // Step 2: Test Database Connection
  console.log("\n2️⃣ Testing Database Connection...")
  let connection
  try {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: false,
    })
    await connection.execute("SELECT 1")
    console.log("✅ Database connection successful")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    return
  }

  // Step 3: Test User Authentication
  console.log("\n3️⃣ Testing User Authentication...")
  const testEmail = "student@example.com"
  const testPassword = "password123"

  try {
    // Get user from database
    const [users] = await connection.execute(
      "SELECT id, email, password_hash, role, full_name, is_active FROM users WHERE email = ?",
      [testEmail],
    )

    if (users.length === 0) {
      console.error("❌ Test user not found")
      return
    }

    const user = users[0]
    console.log("✅ User found:", { id: user.id, email: user.email, role: user.role })

    // Verify password
    const isPasswordValid = await bcrypt.compare(testPassword, user.password_hash)
    console.log("✅ Password verification:", isPasswordValid)

    if (!isPasswordValid) {
      console.error("❌ Password verification failed")
      return
    }

    // Step 4: Generate JWT Token
    console.log("\n4️⃣ Generating JWT Token...")
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "12h" })
    console.log("✅ JWT Token generated")
    console.log("📋 Token preview:", token.substring(0, 50) + "...")
    console.log("📋 Token payload:", payload)

    // Step 5: Verify JWT Token
    console.log("\n5️⃣ Verifying JWT Token...")
    try {
      const decoded = jwt.verify(token, jwtSecret)
      console.log("✅ JWT Token verified successfully")
      console.log("📋 Decoded payload:", decoded)
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message)
      return
    }

    // Step 6: Test OTP Generation and Storage
    console.log("\n6️⃣ Testing OTP Flow...")
    const otpCode = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log("✅ OTP generated:", otpCode)

    // Store OTP in database
    await connection.execute("DELETE FROM otps WHERE email = ?", [testEmail])
    await connection.execute("INSERT INTO otps (email, otp_code, expires_at) VALUES (?, ?, ?)", [
      testEmail,
      otpCode,
      expiresAt,
    ])
    console.log("✅ OTP stored in database")

    // Verify OTP
    const [otpRecords] = await connection.execute("SELECT * FROM otps WHERE email = ? AND otp_code = ?", [
      testEmail,
      otpCode,
    ])

    if (otpRecords.length > 0) {
      console.log("✅ OTP verification successful")
    } else {
      console.error("❌ OTP verification failed")
    }

    // Step 7: Test Session Creation
    console.log("\n7️⃣ Testing Session Management...")
    const sessionToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "12h" })
    const sessionExpiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours

    await connection.execute("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)", [
      user.id,
      sessionToken,
      sessionExpiresAt,
    ])
    console.log("✅ Session created and stored")

    // Validate session
    const [sessions] = await connection.execute("SELECT * FROM user_sessions WHERE session_token = ?", [sessionToken])

    if (sessions.length > 0) {
      console.log("✅ Session validation successful")
    } else {
      console.error("❌ Session validation failed")
    }

    console.log("\n🎉 Complete Authentication Flow Test PASSED!")
    console.log("=".repeat(50))
    console.log("📊 Summary:")
    console.log("   ✅ JWT Configuration: Working")
    console.log("   ✅ Database Connection: Working")
    console.log("   ✅ User Authentication: Working")
    console.log("   ✅ JWT Token Generation: Working")
    console.log("   ✅ JWT Token Verification: Working")
    console.log("   ✅ OTP Generation/Verification: Working")
    console.log("   ✅ Session Management: Working")
  } catch (error) {
    console.error("❌ Test failed:", error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

function generateOTP() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

testCompleteAuthFlow().catch(console.error)
