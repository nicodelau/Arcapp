import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Configuración específica para AFIP
const configureAfipTLS = () => {
  // Solo aplicar en producción donde no tenemos NODE_OPTIONS disponible
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Guardar el agente original
    const originalCreateConnection = https.Agent.prototype.createConnection;
    
    // Sobrescribir temporalmente para AFIP
    https.Agent.prototype.createConnection = function(options: any, callback: any) {
      // Solo aplicar configuración TLS relajada para dominios de AFIP
      if (options.host && (
        options.host.includes('afip.gob.ar') || 
        options.host.includes('wsaa.afip.gov.ar') ||
        options.host.includes('servicios1.afip.gov.ar')
      )) {
        options.secureProtocol = 'TLS_method';
        options.ciphers = 'DEFAULT@SECLEVEL=1';
        options.rejectUnauthorized = false;
      }
      
      return originalCreateConnection.call(this, options, callback);
    };
  }
};

// Aplicar configuración antes de inicializar AFIP
configureAfipTLS();

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, 'base64').toString('utf8');
const key  = Buffer.from(process.env.ARCA_WS_KEY_B64!, 'base64').toString('utf8');

const afip = new Afip({
  production: true,
  cuit:    +process.env.CUIT!,
  cert,
  key,
  ticketPath: TICKETS_DIR
});

export default afip;
