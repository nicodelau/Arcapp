import { Afip } from "afip.ts";
import * as fs from 'fs';
import * as https from 'https';

// Crear un agente HTTPS específico para AFIP
const createAfipAgent = () => {
  return new https.Agent({
    rejectUnauthorized: false, // Solo para AFIP
    keepAlive: true,
    timeout: 60000,
    maxSockets: 5,
    // Configuración específica para los servidores de AFIP
    checkServerIdentity: () => undefined, // Desactivar solo para AFIP
  });
};

// Configurar interceptor solo para dominios de AFIP
const setupAfipInterceptor = () => {
  const originalRequest = https.request;
  
  https.request = function(options: any, callback?: any) {
    // Si es string, convertir a objeto
    if (typeof options === 'string') {
      options = new URL(options);
    }
    
    // Solo aplicar configuración relajada para dominios de AFIP
    const isAfipDomain = options.hostname && (
      options.hostname.includes('afip.gob.ar') ||
      options.hostname.includes('afip.gov.ar') ||
      options.hostname.includes('wsaa.afip.gov.ar') ||
      options.hostname.includes('servicios1.afip.gov.ar') ||
      options.hostname.includes('wswhomo.afip.gov.ar')
    );
    
    if (isAfipDomain) {
      options.agent = createAfipAgent();
      // No tocar NODE_TLS_REJECT_UNAUTHORIZED globalmente
      options.rejectUnauthorized = false;
    }
    
    return originalRequest.call(this, options, callback);
  };
};

// Solo aplicar en producción/Vercel
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  setupAfipInterceptor();
}

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
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
