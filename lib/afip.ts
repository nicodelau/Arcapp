// afip-wrapper.js
import { Afip } from "afip.ts";
import * as fs from 'fs';

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
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

// Retry wrapper for AFIP operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection error worth retrying
      if (
        error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('socket hang up')
      ) {
        console.log(`AFIP request failed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // If it's not a retryable error or we've exhausted retries
      throw error;
    }
  }
  
  throw lastError;
}

// Wrap AFIP methods with retry logic
const afipWithRetry = {
  async getServerStatus() {
    return withRetry(() => afip.electronicBillingService.getServerStatus());
  },
  
  async createVoucher(params: any) {
    return withRetry(() => afip.electronicBillingService.createVoucher(params));
  },
  
  // Add other methods you use
  
  // Direct access to original instance for other operations
  raw: afip
};

export default afipWithRetry;