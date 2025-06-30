# Azure Static Web Apps Deployment Checklist

## 📁 Required Files for Download:
✅ All source code files (.tsx, .ts, .js, .css)
✅ Configuration files (package.json, next.config.js, tailwind.config.js)
✅ Environment templates (.env.example)
✅ Documentation (README.md, deployment guides)
✅ Scripts (database setup, testing utilities)

## 🚫 Files to EXCLUDE:
❌ .env.local (contains sensitive data)
❌ node_modules/ (will be installed during build)
❌ .next/ (build output)
❌ dist/ (build output)
❌ Database credentials (keep secure)

## 📋 Pre-deployment Tasks:
1. Update environment variables for production
2. Configure Azure database connection
3. Set up GitHub repository
4. Configure build settings
5. Test deployment pipeline
\`\`\`

### **Step 2: Production-Ready Configuration**
