# Docker Deployment Guide

## Quick Start

### Development

```bash
docker compose -f docker-compose.dev.yml up
```

Accede a http://localhost:3000 con hot reload automático.

### Production

```bash
docker compose up -d
```

## Image Versions

| Version     | Size   | Status    | Created    |
| ----------- | ------ | --------- | ---------- |
| v2 (latest) | 1.43GB | ✅ Active | 2026-02-22 |
| v1          | 1.63GB | 🔄 Backup | 2026-02-11 |

## Safe Deployment

Use el script de deploy con protecciones automáticas:

```bash
# Deploy la última versión
./scripts/deploy.sh latest

# Deploy versión específica
./scripts/deploy.sh v2

# Rollback a versión anterior
./scripts/deploy.sh v1
```

El script automáticamente:

- ✅ Verifica que la imagen existe
- 📦 Crea backup de la versión anterior
- 🚀 Despliega nueva versión
- ⏳ Espera health check
- 🔄 Rollback automático si falla

## Monitoreo

```bash
# Ver estado de contenedor
./scripts/health-check.sh

# Ver logs en tiempo real
docker compose logs -f web

# Ver métricas de recursos
docker stats claritystructures-web
```

## Rollback Manual

Si algo sale mal:

```bash
# Revertir a v1
docker tag neiland/claritystructures:v1 neiland/claritystructures:latest
docker compose up -d --force-recreate

# O usar backup automático
docker compose down
docker tag neiland/claritystructures:v1-backup neiland/claritystructures:latest
docker compose up -d
```

## Construcción Local

```bash
# Build production
docker build -t neiland/claritystructures:v3 -f Dockerfile .

# Build development
docker build -t neiland/claritystructures:dev -f Dockerfile.dev .

# Tag como latest después de verificar
docker tag neiland/claritystructures:v3 neiland/claritystructures:latest
```

## Checklist Pre-Producción

- [ ] Build local exitoso: `docker build -f Dockerfile .`
- [ ] Image pasa health check: `docker run --rm ... curl localhost:3000`
- [ ] docker-compose.yml apunta a versión correcta
- [ ] .env.production.local existe con variables necesarias
- [ ] Backup de versión anterior creado
- [ ] Logs monitoreados post-deploy
- [ ] Performance metrics dentro de límites normales

## Environment Variables

```bash
# .env.production.local
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
# Añade aquí variables específicas de producción
```

## Troubleshooting

### Container no inicia

```bash
docker compose logs web
docker compose ps
```

### Health check falla

```bash
docker compose exec web curl http://localhost:3000
docker stats claritystructures-web
```

### Limpieza completa

```bash
docker compose down --volumes
docker system prune -a
docker build -f Dockerfile . --no-cache
```

## Información de Contacto

Para issues con deployment:

1. Revisar `DOCKER_VERSIONS.md` para historial de cambios
2. Ejecutar `./scripts/health-check.sh` para diagnóstico
3. Revisar logs: `docker compose logs --tail 100 web`
