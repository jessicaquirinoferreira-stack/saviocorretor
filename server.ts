import express from 'express';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini client with aistudio-build header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint for Sofia - Virtual Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: 'Olá! Sou Sofia, assistente virtual do corretor Sávio (@imoveiscomsavio). Estou à sua disposição para apresentar nossas propriedades exclusivas, simular condições de financiamento ou agendar uma conversa direta com o Sávio no WhatsApp oficial ou Instagram!',
      });
    }

    const systemInstruction = `Você é Sofia, a assistente virtual e consultora imobiliária do corretor Sávio (@imoveiscomsavio).
Seu tom é refinado, caloroso, extremamente profissional e acolhedor.
O portal é especializado em residências e coberturas de alto padrão em regiões como Alphaville, Jardins, Itaim Bibi, Vila Nova Conceição, Fazenda da Grama e Balneário Camboriú.
Suas funções:
1. Ajudar os clientes a entender opções de imóveis, perfis de casas em condomínio, coberturas e lançamentos.
2. Esclarecer dúvidas sobre simulação de financiamento bancário (amortização SAC vs PRICE), compra, venda ou locação de luxo.
3. Estimular e direcionar com cortesia o cliente a agendar uma visita com o Sávio ou falar diretamente no WhatsApp oficial ou seguir o Instagram @imoveiscomsavio.
4. Mantenha respostas concisas (2 a 4 frases), elegantes e orientadas à ação.
Mantenha linguagem focada exclusivamente em assessoria imobiliária de alto padrão, seleção de imóveis nobres e atendimento exclusivo.`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.warn('Gemini Assistant fallback:', error?.message || error);
    return res.json({
      reply: 'Perfeito! Para agilizar seu atendimento com o corretor Sávio (@imoveiscomsavio), convido você a nos chamar diretamente no WhatsApp oficial ou acompanhar as novidades e tours no nosso Instagram!',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
