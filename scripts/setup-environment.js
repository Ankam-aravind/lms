const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

console.log("🔧 Setting up environment for Azure Static Web Apps...")

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString("hex")

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), ".env.local")
const envExamplePath = path.join(process.cwd(), ".env.example")

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy from example and update JWT secret
    let envContent = fs.readFileSync(envExamplePath, "utf8")
    envContent = envContent.replace(
      "JWT_SECRET=your-super-secure-jwt-secret-for-production-make-it-long-and-random",
      `JWT_SECRET=${jwtSecret}`,
    )
    envContent = envContent.replace("NODE_ENV=production", "NODE_ENV=development")
    envContent = envContent.replace(
      "NEXT_PUBLIC_APP_URL=https://your-app-name.azurestaticapps.net",
      "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    )

    fs.writeFileSync(envPath, envContent)
    console.log("✅ Created .env.local from template")
  } else {
    // Create basic .env.local
    const basicEnv = `# Development Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Video Learning Platform"
NODE_ENV=development

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=12h

# bcrypt Configuration
BCRYPT_ROUNDS=12

# Azure Static Web Apps
AZURE_STATIC_WEB_APPS=false
`
    fs.writeFileSync(envPath, basicEnv)
    console.log("✅ Created basic .env.local")
  }
} else {
  console.log("ℹ️  .env.local already exists")
}

console.log("🔐 Generated secure JWT secret")
console.log("📝 Please update .env.local with your database credentials if needed")
console.log("✅ Environment setup complete!")
