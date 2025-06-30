const { authenticateUser, sendOTP, verifyOTP } = require("../lib/auth")

async function testAuthFlow() {
  console.log("🧪 Testing authentication flow...")

  try {
    // Test 1: Authenticate user
    console.log("\n1. Testing user authentication...")
    const authResult = await authenticateUser("student@example.com", "password123")
    console.log("Auth result:", authResult.success ? "✅ Success" : "❌ Failed")
    if (!authResult.success) {
      console.log("Error:", authResult.message)
      return
    }

    // Test 2: Send OTP
    console.log("\n2. Testing OTP generation...")
    const otpResult = await sendOTP("student@example.com")
    console.log("OTP result:", otpResult.success ? "✅ Success" : "❌ Failed")
    if (!otpResult.success) {
      console.log("Error:", otpResult.message)
      return
    }

    if (otpResult.otpCode) {
      console.log("Generated OTP:", otpResult.otpCode)

      // Test 3: Verify OTP
      console.log("\n3. Testing OTP verification...")
      const verifyResult = await verifyOTP("student@example.com", otpResult.otpCode)
      console.log("Verify result:", verifyResult.success ? "✅ Success" : "❌ Failed")
      if (verifyResult.success) {
        console.log("User:", verifyResult.user?.full_name)
        console.log("Token generated:", verifyResult.token ? "✅ Yes" : "❌ No")
      } else {
        console.log("Error:", verifyResult.message)
      }
    }

    console.log("\n🎉 Authentication flow test completed!")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testAuthFlow()
