#!/bin/bash

# Azure Static Web Apps Deployment Script
# This script prepares and deploys the Video Learning Platform to Azure

echo "🚀 Deploying Video Learning Platform to Azure Static Web Apps..."

# Check if required tools are installed
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }
command -v az >/dev/null 2>&1 || { echo "❌ Azure CLI is required but not installed. Aborting." >&2; exit 1; }

# Set variables
APP_NAME="video-learning-platform"
RESOURCE_GROUP="rg-video-learning"
LOCATION="eastus2"

echo "📋 Configuration:"
echo "   App Name: $APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo ""

# Check if logged into Azure
echo "🔐 Checking Azure login status..."
az account show >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged into Azure. Please run 'az login' first."
    exit 1
fi
echo "✅ Azure login verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

# Run tests
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi
echo "✅ Tests passed"

# Build the application
echo "🔨 Building application for production..."
npm run build:azure
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed"

# Check if build output exists
if [ ! -d "out" ]; then
    echo "❌ Build output directory 'out' not found"
    exit 1
fi

echo "📁 Build output size:"
du -sh out/

# Create resource group if it doesn't exist
echo "🏗️  Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION >/dev/null 2>&1
echo "✅ Resource group ready"

# Create Static Web App
echo "🌐 Creating Azure Static Web App..."
STATIC_WEB_APP_NAME="swa-$APP_NAME-$(date +%s)"

# Check if GitHub repository is configured
if [ -z "$GITHUB_REPO" ]; then
    echo "⚠️  GITHUB_REPO environment variable not set"
    echo "   Please set it to your GitHub repository (e.g., username/repo-name)"
    echo "   For manual deployment, we'll create the resource without GitHub integration"
    
    az staticwebapp create \
        --name $STATIC_WEB_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --source "Local" \
        --branch "main" \
        --app-location "/" \
        --output-location "out"
else
    echo "📂 GitHub repository: $GITHUB_REPO"
    az staticwebapp create \
        --name $STATIC_WEB_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --source "https://github.com/$GITHUB_REPO" \
        --branch "main" \
        --app-location "/" \
        --output-location "out"
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to create Static Web App"
    exit 1
fi

# Get the deployment token
echo "🔑 Getting deployment token..."
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo "❌ Failed to get deployment token"
    exit 1
fi

echo "✅ Static Web App created successfully"

# Get the app URL
APP_URL=$(az staticwebapp show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Details:"
echo "   App Name: $STATIC_WEB_APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   URL: https://$APP_URL"
echo "   Deployment Token: $DEPLOYMENT_TOKEN"
echo ""
echo "📝 Next Steps:"
echo "1. Add the deployment token to your GitHub repository secrets as 'AZURE_STATIC_WEB_APPS_API_TOKEN'"
echo "2. Configure your environment variables in the Azure portal"
echo "3. Set up your Azure Database for MySQL"
echo "4. Update your GitHub repository with the workflow file"
echo ""
echo "🔗 Useful Links:"
echo "   Azure Portal: https://portal.azure.com"
echo "   Static Web Apps: https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2FstaticSites"
echo "   Your App: https://$APP_URL"
echo ""
echo "✅ Ready for production!"
