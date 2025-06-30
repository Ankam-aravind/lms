# 🚀 Quick Setup Instructions

## Prerequisites (Install these first):
1. Node.js 18+ (download from nodejs.org)
2. Git (download from git-scm.com)
3. VS Code or your preferred code editor
4. GitHub account
5. Azure account (free tier available)

## Verify installations:
\`\`\`bash
node --version    # Should show v18+ 
npm --version     # Should show 8+
git --version     # Should show git version
\`\`\`

## Project Setup Commands:
\`\`\`bash
# Navigate to your project folder
cd video-learning-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Test the setup
npm run dev
