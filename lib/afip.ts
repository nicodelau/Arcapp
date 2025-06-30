import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Configuración TLS simplificada para evitar conflictos
const setupAfipTLS = () => {
  // Solo configurar lo esencial para AFIP
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const https = require('https');
  
  // Crear un agente HTTPS específico para AFIP con configuración mínima
  const afipAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 60000,
    // Solo usar cipher list sin especificar versiones conflictivas
    secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT,
  });
  
  // Sobrescribir el agente global solo si estamos en Vercel/producción
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    https.globalAgent = afipAgent;
  }
};

// Aplicar configuración
setupAfipTLS();

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

// Verificar variables de entorno
if (!process.env.ARCA_WS_CRT_B64 || !process.env.ARCA_WS_KEY_B64) {
  throw new Error('Faltan variables de entorno: ARCA_WS_CRT_B64 y/o ARCA_WS_KEY_B64');
}

const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, 'base64').toString('utf8');
const key  = Buffer.from(process.env.ARCA_WS_KEY_B64!, 'base64').toString('utf8');

const afip = new Afip({
  production: true,
  cuit: +process.env.CUIT!,
  cert,
  key,
  ticketPath: TICKETS_DIR
});

export default afip;
