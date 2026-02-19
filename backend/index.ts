import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const app = new Hono();

// Middleware de CORS incluido en Hono - Aplicar globalmente
app.use('*', cors());

// Bun lee automáticamente archivos .env, no necesitas 'dotenv'
const API_TOKEN = Bun.env.INSTA_TOKEN;

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';
const INSTAGRAM_URL_FIELDS =
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_url}';
const INSTAGRAM_URL_POSTS = '6';

const FULL_INSTAGRAM_API_URL = `${INSTAGRAM_API_URL}?fields=${INSTAGRAM_URL_FIELDS}&limit=${INSTAGRAM_URL_POSTS}&access_token=${API_TOKEN}`;

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

app.get('/instagram', async (c) => {
    try {
        const filePath = './backend/instagram-data.json';
        const today = new Date();
        let cachedData: any = null;
        let shouldFetchAPI = true;

        try {
            const file = Bun.file(filePath);
            const exists = await file.exists();

            if (exists) {
                cachedData = await file.json();
                const cachedDate = new Date(cachedData.date);

                if (isSameDay(cachedDate, today)) {
                    shouldFetchAPI = false;
                    return c.json({
                        data: cachedData.data,
                    });
                }
            }
        } catch (error) {
            console.error('Error reading cache file:', error);
        }

        if (shouldFetchAPI) {
            const response = await fetch(FULL_INSTAGRAM_API_URL);

            if (!response.ok && response.status) {
                return c.json(
                    { error: 'Error en la API externa' },
                    response.status as ContentfulStatusCode,
                );
            }

            const data = await response.json();

            // Guardar con fecha
            const dataWithDate = {
                date: new Date().toISOString(),
                ...data,
            };

            // Guardar en archivo JSON
            await Bun.write(filePath, JSON.stringify(dataWithDate, null, 2));

            return c.json(data);
        }
    } catch (error) {
        return c.json({ error: 'Fallo en el servidor proxy' }, 500);
    }
});

export default {
    port: 3000,
    fetch: app.fetch,
};
