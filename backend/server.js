import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors({
  origin: true, // Reflects the incoming origin, preventing strict CORS "Network Errors" on new deployments
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded & processed files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      huggingface: !!process.env.HUGGINGFACE_API_TOKEN,
      murf: !!process.env.MURF_API_KEY,
      firebase: !!process.env.FIREBASE_PROJECT_ID,
    },
  });
});

app.use('/api', apiRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start ---------------
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Voiceover Generator API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});

// Configure long timeouts to prevent ECONNRESET during heavy generation logic
server.setTimeout(300000); // 5 minutes overall connection timeout
server.keepAliveTimeout = 120000; // 2 minutes keepAlive
server.headersTimeout = 125000; // slightly above keepAlive to prevent sudden closes

export default app;
