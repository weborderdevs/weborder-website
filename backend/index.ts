import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const app = new Hono();

// Middleware de CORS incluido en Hono - Aplicar globalmente
app.use('*', cors());

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';
const INSTAGRAM_REFRESH_URL =
    'https://graph.instagram.com/refresh_access_token';
const INSTAGRAM_URL_FIELDS =
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_url}';
const INSTAGRAM_URL_POSTS = '6';
const ENV_FILE_PATH = '.env';
const TOKEN_REFRESH_DAYS = 50;

// Token en memoria para la sesión actual (Bun.env no se actualiza en caliente)
let currentToken = Bun.env.INSTA_TOKEN ?? '';

async function updateEnvToken(newToken: string): Promise<void> {
    const file = Bun.file(ENV_FILE_PATH);
    const content = await file.text();
    const now = new Date().toISOString();

    let updated = content.replace(
        /^INSTA_TOKEN=.*/m,
        `INSTA_TOKEN=${newToken}`,
    );

    if (/^INSTA_TOKEN_LAST_REFRESH=.*/m.test(updated)) {
        updated = updated.replace(
            /^INSTA_TOKEN_LAST_REFRESH=.*/m,
            `INSTA_TOKEN_LAST_REFRESH=${now}`,
        );
    } else {
        updated += `\nINSTA_TOKEN_LAST_REFRESH=${now}`;
    }

    await Bun.write(ENV_FILE_PATH, updated);
}

async function getValidToken(): Promise<string> {
    if (!currentToken) throw new Error('INSTA_TOKEN no está configurado');

    const lastRefreshStr = Bun.env.INSTA_TOKEN_LAST_REFRESH;
    const lastRefresh = lastRefreshStr ? new Date(lastRefreshStr) : new Date(0);
    const daysSinceRefresh =
        (Date.now() - lastRefresh.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceRefresh >= TOKEN_REFRESH_DAYS) {
        console.log(
            `Token tiene ${Math.floor(daysSinceRefresh)} días, renovando...`,
        );
        const refreshRes = await fetch(
            `${INSTAGRAM_REFRESH_URL}?grant_type=ig_refresh_token&access_token=${currentToken}`,
        );

        if (!refreshRes.ok) {
            console.error(
                'Error al renovar token de Instagram:',
                await refreshRes.text(),
            );
            return currentToken;
        }

        const refreshData = (await refreshRes.json()) as {
            access_token: string;
        };
        currentToken = refreshData.access_token;
        await updateEnvToken(currentToken);
        console.log('Token de Instagram renovado exitosamente');
    }

    return currentToken;
}

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
            const token = await getValidToken();
            const FULL_INSTAGRAM_API_URL = `${INSTAGRAM_API_URL}?fields=${INSTAGRAM_URL_FIELDS}&limit=${INSTAGRAM_URL_POSTS}&access_token=${token}`;
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
