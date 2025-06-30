// Test script to verify JWT functionality
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: ".env.local" })

function testJWT() {
  console.log("🧪 Testing JWT functionality...")

  // Check if JWT_SECRET exists
  const secret = process.env.JWT_SECRET
  console.log("🔍 JWT_SECRET exists:", !!secret)
  console.log("🔍 JWT_SECRET length:", secret?.length || 0)
  console.log("🔍 JWT_SECRET preview:", secret?.substring(0, 20) + "..." || "undefined")

  if (!secret) {
    console.error("❌ JWT_SECRET not found in environment variables")
    return
  }

  try {
    // Test payload
    const testPayload = {
      userId: 1,
      email: "test@example.com",
      role: "STUDENT",
      iat: Math.floor(Date.now() / 1000),
    }

    // Sign token
    console.log("🔐 Signing test token...")
    const token = jwt.sign(testPayload, secret, { expiresIn: "1h" })
    console.log("✅ Token signed successfully")
    console.log("🎫 Token preview:", token.substring(0, 50) + "...")

    // Verify token
    console.log("🔍 Verifying test token...")
    const decoded = jwt.verify(token, secret)
    console.log("✅ Token verified successfully")
    console.log("📋 Decoded payload:", decoded)

    console.log("🎉 JWT test completed successfully!")
  } catch (error) {
    console.error("❌ JWT test failed:", error.message)
  }
}

testJWT()
