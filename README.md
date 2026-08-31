# WeBorder Developers

Comunidad del Borderplex. Código, comunidad y colaboración sin fronteras.

Sitio web SPA + API proxy de Instagram para la comunidad [WeBorder Developers](https://www.weborder.dev).

## Tech Stack

| Capa     | Tecnología                             |
| -------- | -------------------------------------- |
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Backend  | Bun, Hono, TypeScript                  |
| Fuentes  | JetBrains Mono, Caveat                 |
| Iconos   | Feather Icons                          |

## Estructura

```
weborder-website/
├── compose.yml               # Docker Compose (backend + frontend)
├── AGENTS.md                 # Guía para agentes y contribuidores
├── frontend/                 # Sitio estático (SPA)
│   ├── index.html            # Página principal
│   ├── styles.css            # Estilos
│   ├── scripts.js            # Lógica JS
│   ├── Dockerfile            # Imagen nginx
│   ├── nginx.conf            # Proxy /instagram → servicio backend
│   ├── terminal-messages.json  # Mensajes de la terminal animada
│   └── img/                  # Imágenes (logo, meetups, team)
├── backend/                  # API proxy
│   ├── index.ts              # Servidor Hono
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
└── .env.example
```

## Cómo correr

### Opción 1: Docker (recomendada)

```bash
cp .env.example .env       # editar y agregar INSTA_TOKEN
docker compose up -d --build
```

- Frontend: abre `http://localhost:8080`.
- El frontend consume la galería de meetups desde `/instagram` (ruta relativa) y nginx (`frontend/nginx.conf`) reenvía la petición al servicio `backend` por la red interna de Docker. El puerto 3000 del backend **no** se publica al host.
- Detener: `docker compose down`.

### Opción 2: Local

#### Backend

```bash
bun install --cwd backend
cp .env.example .env
# Editar .env y agregar INSTA_TOKEN
bun run backend/index.ts
```

La API corre en `localhost:3000/instagram`. Ejecutar desde la raíz del repositorio (el servidor lee/escribe la caché en `backend/instagram-data.json`).

#### Frontend

```bash
python3 -m http.server 8080 -d frontend/
# o
bunx serve frontend/ --port 8080
```

Abrir `http://localhost:8080`.

> **Nota:** con el servidor estático local la galería de meetups usa las imágenes de respaldo (`frontend/img/meetups/`), porque `/instagram` no existe en ese origen. Para ver las imágenes de Instagram en local, usa la Opción 1 (Docker) donde nginx proxy a `/instagram`.

## Variables de entorno

| Variable      | Descripción                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INSTA_TOKEN` | Token de acceso a Instagram Graph API (requerido para `/instagram`), para generarlo, se debe entrar en https://developers.facebook.com/apps/[appid]/instagram-business/API-Setup/ |

## Mensajes de la terminal

Los mensajes que aparecen en la terminal animada del hero se editan en `frontend/terminal-messages.json`. No requiere tocar código.

## Features

- Terminal animada con mensajes rotativos tipo CLI
- Vista de Podcast con episodios
- Galería de Meetups con integración Instagram
- Modal de imágenes a pantalla completa
- Atajos de teclado: `P` (Podcast), `M` (Meetups), `A` (Acerca), `Escape` (cerrar)
- Diseño responsive, dark theme cyberpunk
- Header fijo con navegación tipo overlay
