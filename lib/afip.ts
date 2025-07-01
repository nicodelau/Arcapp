import { Afip } from "afip.ts";
import * as fs from 'fs';

// Configuración TLS solo para entorno de producción usando variables de entorno
const setupProductionTLS = () => {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Configurar TLS de forma segura solo cuando sea necesario
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    // Crear y configurar agente HTTPS global específico para AFIP
    const https = require('https');
    const originalAgent = https.globalAgent;
    
    https.globalAgent = new https.Agent({
      ...originalAgent.options,
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: 60000,
      maxSockets: 10
    });
  }
};

setupProductionTLS();

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

// Verificar variables de entorno requeridas
if (!process.env.ARCA_WS_CRT_B64 || !process.env.ARCA_WS_KEY_B64 || !process.env.CUIT) {
  throw new Error('Faltan variables de entorno requeridas: ARCA_WS_CRT_B64, ARCA_WS_KEY_B64, CUIT');
}

const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, 'base64').toString('utf8');
const key = Buffer.from(process.env.ARCA_WS_KEY_B64!, 'base64').toString('utf8');

const afip = new Afip({
  production: true,
  cuit: +process.env.CUIT!,
  cert,
  key,
  ticketPath: TICKETS_DIR
});

export default afip;
