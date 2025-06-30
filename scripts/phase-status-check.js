const fs = require("fs")
const path = require("path")

function checkPhase1Status() {
  console.log("🔍 Phase 1 Status Check")
  console.log("=".repeat(50))

  const checks = [
    {
      name: "Environment Configuration",
      check: () => fs.existsSync(".env.local"),
      status: false,
    },
    {
      name: "Database Schema",
      check: () => fs.existsSync("scripts/setup-hostinger-database.js"),
      status: false,
    },
    {
      name: "Authentication System",
      check: () => fs.existsSync("lib/auth.ts"),
      status: false,
    },
    {
      name: "JWT Implementation",
      check: () => fs.existsSync("scripts/test-jwt.js"),
      status: false,
    },
    {
      name: "UI Components",
      check: () => fs.existsSync("components/ui/button.tsx"),
      status: false,
    },
    {
      name: "Login Page",
      check: () => fs.existsSync("app/login/page.tsx"),
      status: false,
    },
    {
      name: "Dashboard",
      check: () => fs.existsSync("app/dashboard/page.tsx"),
      status: false,
    },
    {
      name: "API Routes",
      check: () => fs.existsSync("app/api/auth/login/route.ts"),
      status: false,
    },
  ]

  let completedChecks = 0

  checks.forEach((check) => {
    try {
      check.status = check.check()
      if (check.status) {
        console.log(`✅ ${check.name}`)
        completedChecks++
      } else {
        console.log(`❌ ${check.name}`)
      }
    } catch (error) {
      console.log(`❌ ${check.name} (Error: ${error.message})`)
    }
  })

  const completionRate = (completedChecks / checks.length) * 100

  console.log("\n📊 Phase 1 Completion Status:")
  console.log(`   Completed: ${completedChecks}/${checks.length} (${completionRate.toFixed(1)}%)`)

  if (completionRate === 100) {
    console.log("🎉 Phase 1 is COMPLETE! Ready for Phase 2.")
  } else if (completionRate >= 80) {
    console.log("🔄 Phase 1 is nearly complete. Few items remaining.")
  } else {
    console.log("⚠️  Phase 1 needs more work before moving to Phase 2.")
  }

  console.log("\n🚀 Next Steps:")
  if (completionRate === 100) {
    console.log("   1. Deploy Phase 1 to production")
    console.log("   2. Begin Phase 2: Course Management System")
    console.log("   3. Set up Phase 2 development environment")
  } else {
    console.log("   1. Complete remaining Phase 1 items")
    console.log("   2. Test all authentication flows")
    console.log("   3. Verify database connectivity")
  }
}

checkPhase1Status()
