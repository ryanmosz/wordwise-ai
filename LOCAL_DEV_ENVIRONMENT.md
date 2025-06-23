# WordWise Local Development Environment

## 🚨 CRITICAL: Docker-First Development

**ALL development happens through Docker. Docker gets port 3000. Period.**

## Quick Start

```bash
# From project root (where docker-compose.yml is located)
docker-compose up -d

# Access the application
open http://localhost:3000
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Your Browser                                            │
│ http://localhost:3000                                   │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼ Port 3000
┌─────────────────────────────────────────────────────────┐
│ Docker Container: wordwise-frontend-1                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Vite Dev Server (inside container)                  │ │
│ │ - Runs on port 3000 inside container                │ │
│ │ - Hot Module Replacement enabled                    │ │
│ │ - Watches ./frontend directory                      │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Key Points

1. **Docker owns port 3000** - The frontend container is mapped to `0.0.0.0:3000->3000/tcp`
2. **Vite runs INSIDE Docker** - Not on your local machine
3. **Code is volume-mounted** - Changes in `./frontend` are instantly available in container
4. **Hot reload works** - Vite's HMR works through Docker

## File Structure

```
wordwise/
├── docker-compose.yml      # Docker orchestration
├── frontend/
│   ├── Dockerfile.dev      # Frontend container config
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── src/                # Application code
└── .env                    # Environment variables
```

## Common Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker logs wordwise-frontend-1 -f

# Stop everything
docker-compose down

# Rebuild containers (if dependencies change)
docker-compose build
docker-compose up -d

# Check what's running
docker ps | grep wordwise
```

## Vite Configuration

The `frontend/vite.config.ts` is configured for Docker:

```typescript
server: {
  port: 3000,        // Port inside container
  host: true,        // Listen on all interfaces
  watch: {
    usePolling: true // Required for Docker volumes
  }
}
```

## Environment Variables

- Stored in root `.env` file
- Passed to Docker container via `docker-compose.yml`
- Available in Vite as `import.meta.env.VITE_*`

## Troubleshooting

### Port 3000 Already in Use?

```bash
# Check what's using port 3000
lsof -i :3000

# If it's not Docker, kill it and restart Docker
docker-compose down
docker-compose up -d
```

### Can't Access http://localhost:3000?

```bash
# Check if container is running
docker ps | grep wordwise-frontend

# Check container logs
docker logs wordwise-frontend-1

# Restart containers
docker-compose restart
```

### Code Changes Not Reflecting?

1. Check Docker logs for errors
2. Ensure file is saved
3. Check for TypeScript/build errors
4. Try restarting the container

## DO NOT

- ❌ Run `npm run dev` directly on your machine
- ❌ Try to change Docker's port (it's always 3000)
- ❌ Install node_modules locally (they're in the container)
- ❌ Use `strictPort` in Vite config (Docker handles ports)

## Summary

**Docker is the development environment. Docker gets port 3000. All testing happens at http://localhost:3000. Vite runs inside Docker, not on your local machine.**

When in doubt: `docker-compose down && docker-compose up -d` 