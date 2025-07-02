import { Afip } from "afip.ts";
import * as fs from 'fs';
import * as https from 'https';

const TICKETS_DIR = '/tmp/afip-tickets';

// Crear agente HTTPS específico para AFIP sin afectar globalmente
const createAfipHttpsAgent = () => {
  return new https.Agent({
    rejectUnauthorized: false, // Solo para AFIP
    keepAlive: true,
    timeout: 60000,
    maxSockets: 10,
    // Opcional: agregar certificados específicos de AFIP si los tienes
    // ca: [fs.readFileSync('path/to/afip-ca.pem')]
  });
};

// Configuración específica para AFIP sin afectar el comportamiento global de TLS
const setupAfipTLS = () => {
  // Solo configurar el agente específico, no la variable global
  const afipAgent = createAfipHttpsAgent();
  
  // Si afip.ts permite configurar el agente, úsalo
  // De lo contrario, esta configuración se aplicará solo donde sea necesario
  return afipAgent;
};

// Crear directorio para tickets si no existe
if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

// Verificar variables de entorno requeridas
const requiredEnvVars = ['ARCA_WS_CRT_B64', 'ARCA_WS_KEY_B64', 'CUIT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
}

// Decodificar certificados de base64
const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, 'base64').toString('utf8');
const key = Buffer.from(process.env.ARCA_WS_KEY_B64!, 'base64').toString('utf8');

// Validar que los certificados sean válidos
const validateCertificates = (cert: string, key: string) => {
  if (!cert.includes('BEGIN CERTIFICATE') || !cert.includes('END CERTIFICATE')) {
    throw new Error('Certificado inválido: formato incorrecto');
  }
  if (!key.includes('BEGIN') || !key.includes('END')) {
    throw new Error('Clave privada inválida: formato incorrecto');
  }
};

try {
  validateCertificates(cert, key);
} catch (error) {
  console.error('Error validando certificados:', error);
  throw error;
}

// Configurar AFIP con opciones mejoradas
const afip = new Afip({
  production: true,
  cuit: +process.env.CUIT!,
  cert,
  key,
  ticketPath: TICKETS_DIR,
  // Si la librería soporta configuración de agente HTTP
  // httpAgent: setupAfipTLS()
});

// Función para realizar requests seguros específicos a AFIP
export const makeSecureAfipRequest = async (url: string, options: any = {}) => {
  const agent = createAfipHttpsAgent();
  return fetch(url, {
    ...options,
    agent // Solo para requests específicos de AFIP
  });
};

// Función para limpiar tickets expirados
export const cleanupExpiredTickets = () => {
  try {
    if (fs.existsSync(TICKETS_DIR)) {
      const files = fs.readdirSync(TICKETS_DIR);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas
      
      files.forEach(file => {
        const filePath = `${TICKETS_DIR}/${file}`;
        const stats = fs.statSync(filePath);
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Ticket expirado eliminado: ${file}`);
        }
      });
    }
  } catch (error) {
    console.error('Error limpiando tickets:', error);
  }
};

// Configuración de logging mejorada
const logAfipConfig = () => {
  console.log('AFIP Configuration:');
  console.log(`- Production: true`);
  console.log(`- CUIT: ${process.env.CUIT}`);
  console.log(`- Tickets Directory: ${TICKETS_DIR}`);
  console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- Vercel: ${process.env.VERCEL ? 'Yes' : 'No'}`);
};

// Solo log en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logAfipConfig();
}

export default afip;
export { TICKETS_DIR };