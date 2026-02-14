import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const app = new Hono();

// Middleware de CORS incluido en Hono
app.use('/api/*', cors());

// Bun lee automáticamente archivos .env, no necesitas 'dotenv'
const API_TOKEN = Bun.env.INSTA_TOKEN;

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';
const INSTAGRAM_URL_FIELDS =
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const INSTAGRAM_URL_POSTS = '6';

const FULL_INSTAGRAM_API_URL = `${INSTAGRAM_API_URL}?fields=${INSTAGRAM_URL_FIELDS}&limit=${INSTAGRAM_URL_POSTS}&access_token=${API_TOKEN}`;
app.get('/instagram', async (c) => {
    try {
        const response = await fetch(FULL_INSTAGRAM_API_URL);

        if (!response.ok && response.status) {
            return c.json(
                { error: 'Error en la API externa' },
                response.status as ContentfulStatusCode,
            );
        }

        const data = await response.json();
        return c.json(data);
    } catch (error) {
        return c.json({ error: 'Fallo en el servidor proxy' }, 500);
    }
    //return c.json({ message: "Endpoint de Instagram funcionando correctamente" });
});

export default {
    port: 3000,
    fetch: app.fetch,
};
