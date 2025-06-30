const crypto = require("crypto")

// Generate a secure random secret
const jwtSecret = crypto.randomBytes(64).toString("hex")

console.log("🔐 Generated JWT Secret:")
console.log(jwtSecret)
console.log("\n📝 Add this to your .env.local file:")
console.log(`JWT_SECRET=${jwtSecret}`)

// Also generate other secrets you might need
console.log("\n🔑 Additional secrets:")
console.log(`SESSION_SECRET=${crypto.randomBytes(32).toString("hex")}`)
console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString("hex")}`)
