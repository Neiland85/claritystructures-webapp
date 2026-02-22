#!/bin/bash
# Health check and monitoring script

echo "🏥 Container Health Check"
echo "========================"
echo ""

# Container status
echo "📊 Container Status:"
docker compose ps
echo ""

# Health check details
if docker compose ps | grep -q claritystructures-web; then
    echo "🔍 Health Check Result:"
    docker compose exec -T web node -e "require('http').get('http://localhost:3000', (r) => console.log('Status Code:', r.statusCode))" 2>/dev/null || echo "⚠️  Health check endpoint not responding"
    echo ""
fi

# Container logs (last 20 lines)
echo "📝 Recent Logs (last 20 lines):"
docker compose logs --tail 20 web
echo ""

# Resource usage
echo "💻 Resource Usage:"
docker stats --no-stream claritystructures-web 2>/dev/null || echo "⚠️  Container not running"
echo ""

# Image info
echo "📦 Image Information:"
IMAGE=$(docker compose config --format json 2>/dev/null | grep -o '"image": "[^"]*' | cut -d'"' -f4 || echo "unknown")
if [ "$IMAGE" != "unknown" ]; then
    docker inspect "$IMAGE" --format="  Created: {{.Created}}\n  Size: {{.VirtualSize}}\n  Digest: {{.Id}}"
fi
