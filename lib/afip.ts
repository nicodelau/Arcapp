import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Configuración TLS agresiva para AFIP
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --tls-cipher-list=DEFAULT@SECLEVEL=1';

// Configurar antes de cualquier import o uso de HTTPS
const setupAfipTLS = () => {
  const tls = require('tls');
  const https = require('https');
  
  // Configuración de TLS más permisiva
  const origCreateSecureContext = tls.createSecureContext;
  tls.createSecureContext = (options: any) => {
    const context = origCreateSecureContext({
      ...options,
      ciphers: 'DEFAULT@SECLEVEL=1',
      secureProtocol: 'TLS_method',
      minVersion: 'TLSv1',
      maxVersion: 'TLSv1.3',
    });
    return context;
  };

  // Configurar agente HTTPS global
  https.globalAgent = new https.Agent({
    secureProtocol: 'TLS_method',
    ciphers: 'DEFAULT@SECLEVEL=1',
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 60000,
    minVersion: 'TLSv1',
    maxVersion: 'TLSv1.3'
  });
};

setupAfipTLS();

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

// Función helper para reintentos en caso de ECONNRESET
export const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.code === 'ECONNRESET' && i < retries - 1) {
        console.log(`Reintentando operación AFIP (intento ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
};

export default afip;
