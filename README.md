# WeBorder Developers

Comunidad del Borderplex. Código, comunidad y colaboración sin fronteras.

Sitio web SPA + API proxy de Instagram para la comunidad [WeBorder Developers](https://www.weborder.dev).

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| Backend | Bun, Hono, TypeScript |
| Fuentes | JetBrains Mono, Caveat |
| Iconos | Feather Icons |

## Estructura

```
weborder-website/
├── frontend/              # Sitio estático (SPA)
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos
│   ├── scripts.js         # Lógica JS
│   ├── terminal-messages.json  # Mensajes de la terminal animada
│   └── img/               # Imágenes (logo, meetups, team)
├── backend/               # API proxy
│   ├── index.ts           # Servidor Hono
│   ├── package.json
│   └── tsconfig.json
└── .env.example
```

## Cómo correr local

### Backend

```bash
bun install --cwd backend
cp .env.example .env
# Editar .env y agregar INSTA_TOKEN
bun run backend/index.ts
```

La API corre en `localhost:3000/instagram`.

### Frontend

```bash
python3 -m http.server 8080 -d frontend/
# o
bunx serve frontend/ --port 8080
```

Abrir `http://localhost:8080`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `INSTA_TOKEN` | Token de acceso a Instagram Graph API (requerido para `/instagram`) |

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
