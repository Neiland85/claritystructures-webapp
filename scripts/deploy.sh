#!/bin/bash
# Safe Docker deployment script
# Usage: ./scripts/deploy.sh [v1|v2|latest]

set -e

VERSION=${1:-latest}
IMAGE="neiland/claritystructures:${VERSION}"
BACKUP_TAG="neiland/claritystructures:backup-$(date +%Y%m%d-%H%M%S)"

echo "🔍 Docker Deployment Safety Check"
echo "=================================="
echo ""

# Check if image exists
if ! docker image inspect "$IMAGE" > /dev/null 2>&1; then
    echo "❌ Error: Image $IMAGE does not exist"
    echo "Available images:"
    docker images neiland/claritystructures --format "  - {{.Repository}}:{{.Tag}} ({{.Size}})"
    exit 1
fi

echo "✅ Image found: $IMAGE"
echo ""

# Backup current running container
if [ "$(docker ps -q -f name=claritystructures-web)" ]; then
    echo "📦 Backing up current deployment..."
    CURRENT_IMAGE=$(docker inspect claritystructures-web --format='{{.Config.Image}}')
    docker tag "$CURRENT_IMAGE" "$BACKUP_TAG"
    echo "✅ Backup created: $BACKUP_TAG"
    echo ""
fi

# Stop current container
echo "🛑 Stopping current container..."
docker compose down

# Deploy new version
echo "🚀 Deploying version: $VERSION"
docker compose up -d

# Wait for health check
echo "⏳ Waiting for container to be healthy..."
for i in {1..30}; do
    if docker compose ps | grep -q "healthy"; then
        echo "✅ Container is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Container failed to become healthy within 30 seconds"
        echo "🔄 Rolling back to previous version..."
        docker compose down
        docker tag "$BACKUP_TAG" "$CURRENT_IMAGE"
        docker tag "$CURRENT_IMAGE" "neiland/claritystructures:latest"
        docker compose up -d
        echo "⚠️  Rolled back to: $CURRENT_IMAGE"
        exit 1
    fi
    sleep 1
done

echo ""
echo "✅ Deployment successful!"
echo "📋 Running container info:"
docker compose ps
echo ""
echo "🔙 To rollback:"
echo "   docker tag $BACKUP_TAG neiland/claritystructures:latest"
echo "   docker compose up -d --force-recreate"
