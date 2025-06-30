#!/bin/bash

echo "🚀 Deploying Video Learning Platform to Azure Static Web Apps"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build for production
echo "🏗️ Building for production..."
npm run build:azure

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed. 'out' directory not found."
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Output directory: ./out"
echo "🌐 Ready for Azure Static Web Apps deployment"

# Display next steps
echo ""
echo "🔄 Next Steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. GitHub Actions will automatically deploy to Azure"
echo "3. Check your Azure Static Web Apps dashboard"
echo "4. Configure environment variables in Azure portal"
echo ""
echo "🎉 Deployment preparation complete!"
