import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Ejemplo de Endpoint Serverless (Vercel Serverless / Cloudflare Worker / Node.js)
 * para publicar TurboSpotter en Google Play Store con total seguridad.
 *
 * Tu API Key se almacena como variable de entorno protegida (process.env.GEMINI_API_KEY).
 * Ningún usuario o decompilador del APK de Android puede verla.
 */

export default async function handler(req, res) {
  // Configuración de CORS para tu aplicación móvil y web
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Falta la imagen en base64" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no configurada en el servidor" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `Analiza esta imagen y detecta con precisión el vehículo visible (auto, SUV, camioneta o moto).
Responde ÚNICAMENTE en formato JSON con esta estructura exacta sin bloques markdown:
{
  "marca": "Nombre de la marca (ej: Honda, Ford, Porsche, Ducati)",
  "modelo": "Nombre del modelo y año aproximado si es visible (ej: CR-V 2024, Mustang GT, Panigale V4)",
  "nombreCompleto": "Marca y modelo completos (ej: Honda CR-V 2024)",
  "tipo": "Auto o Moto",
  "carroceria": "SUV, Sedán, Coupé, Superbike, Hatchback, etc.",
  "potencia": "Potencia estimada con unidad CV (ej: 190 CV, 500 CV)",
  "rareza": "comun, raro, epico o legendario",
  "confianza": 0.95
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      }
    ]);

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error identificando vehículo:", error);
    return res.status(500).json({ error: "Error en el análisis de visión", details: error.message });
  }
}
