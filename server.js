require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Habilitar CORS para recibir peticiones de la app web y móvil (Android)
app.use(cors());

// Permitir payloads de imágenes grandes en Base64 (hasta 20MB)
app.use(express.json({ limit: '20mb' }));

// Caché en memoria para no gastar cuota si se analiza la misma foto o modelo frecuente
const cacheRespuestas = new Map();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'TurboSpotter AI Backend',
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

app.post('/api/identify', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Falta la imagen en base64' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY no configurada en el servidor. Agrégala en el archivo .env.'
      });
    }

    const mimeMatch = image.match(/^data:(image\/[a-zA-Z0-9\.\+-]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = image.replace(/^data:image\/[a-zA-Z0-9\.\+-]+;base64,/, '');

    // Lista de modelos de visión con fallback automático si uno tiene alta demanda
    const modelosParaProbar = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `Analiza esta imagen con precisión automotriz profesional.
Detecta el vehículo principal visible (auto, SUV, camioneta, moto o superdeportivo).
Determina:
1. Marca oficial exacta (ej: Honda, Ford, Ferrari, BMW, Ducati, etc.).
2. Modelo y generación/año aproximado (ej: CR-V 2024, Mustang Dark Horse, SF90 Stradale, Panigale V4).
3. Nombre completo con marca y modelo (ej: "Honda CR-V 2024").
4. Tipo: "Auto" o "Moto".
5. Carrocería (ej: SUV, Sedán, Coupé, Superbike, Hatchback, etc.).
6. Potencia estimada de fábrica en CV (ej: 190 CV, 500 CV).
7. Precio aproximado de mercado en dólares estadounidenses USD formateado con signo $ y comas (ej: "$35,000", "$120,000", "$625,000", "$18,500").
8. Rareza justa para un juego de carspotting: "comun" (vehículos de diario como CR-V, Corolla, Civic), "raro" (deportivos de gama media o paquetes M/AMG), "epico" (superdeportivos o clásicos codiciados), "legendario" (hiperautos o ediciones únicas limitadas).

Responde ÚNICAMENTE en JSON con esta estructura:
{
  "marca": "string",
  "modelo": "string",
  "nombreCompleto": "string",
  "tipo": "Auto" | "Moto",
  "carroceria": "string",
  "potencia": "string",
  "precio": "string",
  "rareza": "comun" | "raro" | "epico" | "legendario"
}`;

    let vehiculoDetectado = null;
    let ultimoError = null;

    for (const modelName of modelosParaProbar) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        });

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: mimeType === 'image/avif' ? 'image/jpeg' : mimeType,
              data: cleanBase64
            }
          }
        ]);

        const responseText = result.response.text();
        vehiculoDetectado = JSON.parse(responseText);
        if (vehiculoDetectado && vehiculoDetectado.marca) {
          console.log(`✅ Vehículo identificado exitosamente con ${modelName}:`, vehiculoDetectado.nombreCompleto);
          break;
        }
      } catch (err) {
        ultimoError = err;
        console.warn(`Aviso: ${modelName} no respondió (${err.message}). Intentando siguiente modelo...`);
      }
    }

    if (!vehiculoDetectado) {
      throw ultimoError || new Error("No se pudo identificar el vehículo con ninguno de los modelos");
    }

    return res.status(200).json(vehiculoDetectado);
  } catch (error) {
    console.error('Error al identificar vehículo con IA:', error);
    return res.status(500).json({
      error: 'Error procesando la imagen',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚗 TurboSpotter Backend Server corriendo en http://localhost:${PORT}`);
  console.log(`📡 Endpoint de identificación listo: POST http://localhost:${PORT}/api/identify`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`⚠️ ATENCIÓN: Pega tu GEMINI_API_KEY en el archivo .env para activar el escaneo real.`);
  } else {
    console.log(`✨ Gemini API Key cargada correctamente y protegida en el servidor.`);
  }
});
