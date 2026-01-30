import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware de CORS incluido en Hono
app.use("/api/*", cors());

// Bun lee automáticamente archivos .env, no necesitas 'dotenv'
const API_TOKEN = Bun.env.MY_SECRET_TOKEN;
const EXTERNAL_API_URL = "https://api.ejemplo.com/data";

app.get("/instagram", async (c) => {
  /*
  try {
    const response = await fetch(EXTERNAL_API_URL, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return c.json({ error: 'Error en la API externa' }, response.status);
    }

    const data = await response.json();
    return c.json(data);
    
  } catch (error) {
    return c.json({ error: 'Fallo en el servidor proxy' }, 500);
  }*/
  return c.json({ message: "Endpoint de Instagram funcionando correctamente" });
});

export default {
  port: 3000,
  fetch: app.fetch,
};


