#!/bin/bash

# Quick Docker health check for WordWise containers

echo "==================================="
echo "Docker Container Health Check"
echo "==================================="
echo ""

# Check if containers are running
echo "1. Container Status:"
docker-compose ps

echo ""
echo "2. Container Health:"
for container in wordwise-frontend-1 wordwise-postgres-1; do
    STATUS=$(docker inspect $container 2>/dev/null | jq -r '.[0].State.Status' 2>/dev/null)
    if [ "$STATUS" = "running" ]; then
        echo "✅ $container: Running"
    else
        echo "❌ $container: Not running or not found"
    fi
done

echo ""
echo "3. Recent Frontend Logs (errors only):"
docker-compose logs frontend 2>&1 | grep -i error | tail -5 || echo "No recent errors"

echo ""
echo "4. Frontend Port Check:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend responding on port 3000"
else
    echo "❌ Frontend not responding on port 3000"
fi 