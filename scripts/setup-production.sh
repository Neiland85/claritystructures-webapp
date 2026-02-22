#!/bin/bash
# Pre-deployment setup script
# Usage: ./scripts/setup-production.sh

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  ClarityStructures - Production Setup Script          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo "⚠️  .env.production.local not found"
    echo ""
    echo "📋 Creating from template..."
    cp .env.production.local.example .env.production.local
    echo "✅ Created: .env.production.local"
    echo ""
    echo "🔴 REQUIRED: Edit .env.production.local with production values:"
    echo "   - DATABASE_URL (Supabase)"
    echo "   - SMTP_* (Email)"
    echo "   - JWT_SECRET, SESSION_SECRET, CRON_SECRET (32+ chars)"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo ""
    exit 1
fi

echo "✅ .env.production.local found"
echo ""

# Verify required variables
echo "🔍 Checking required environment variables..."
REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "SESSION_SECRET" "CRON_SECRET" "NEXT_PUBLIC_APP_URL")

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env.production.local; then
        value=$(grep "^${var}=" .env.production.local | cut -d'=' -f2- | cut -c1-20)
        if [ -z "$value" ] || [ "$value" = "your-" ]; then
            echo "❌ $var: Not set properly"
            exit 1
        fi
        echo "✅ $var: Configured"
    else
        echo "❌ $var: Missing"
        exit 1
    fi
done

echo ""
echo "✅ All required variables configured"
echo ""

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t neiland/claritystructures:v2-$(date +%Y%m%d) -f Dockerfile . --progress=plain 2>&1 | tail -10

echo ""
echo "✅ Docker image built successfully"
echo ""

# Verify image
echo "🔍 Verifying image..."
docker run --rm neiland/claritystructures:v2-$(date +%Y%m%d) node -v > /dev/null 2>&1
echo "✅ Image verified"
echo ""

# Final checklist
echo "════════════════════════════════════════════════════════"
echo "📋 PRE-DEPLOYMENT CHECKLIST"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Before running deploy:"
echo ""
echo "[ ] 1. All environment variables set in .env.production.local"
echo "[ ] 2. Database backups created"
echo "[ ] 3. Team notified of deployment"
echo "[ ] 4. Monitoring dashboard ready"
echo ""
echo "To deploy:"
echo "  ./scripts/deploy.sh latest"
echo ""
echo "To verify:"
echo "  ./scripts/health-check.sh"
echo ""
echo "To rollback:"
echo "  ./scripts/deploy.sh v1"
echo ""
