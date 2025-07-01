import { Afip } from "afip.ts";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";

// Directorio para tickets
const TICKETS_DIR = "/tmp/afip-tickets";
if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

// Validar env vars
for (const v of ["ARCA_WS_CRT_B64", "ARCA_WS_KEY_B64", "CUIT"]) {
  if (!process.env[v]) {
    throw new Error(`Falta la variable de entorno ${v}`);
  }
}

// Convertir base64 → PEM
const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, "base64");
const key  = Buffer.from(process.env.ARCA_WS_KEY_B64!, "base64");
// Cargar la CA de AFIP que guardaste en tu repo
const ca   = fs.readFileSync(path.join(__dirname, "arca_ws_ca.pem"));

// Crear agente HTTPS seguro
const agent = new https.Agent({
  cert,
  key,
  ca,
  keepAlive: true,
  timeout: 60_000,
  maxSockets: 10,
  rejectUnauthorized: true,    // ¡importante que siga validando!
});

// Inicializar Afip con ese agente
const afip = new Afip({
  production: true,
  cuit: Number(process.env.CUIT),
  cert: cert.toString("utf8"),
  key : key.toString("utf8"),
  ticketPath: TICKETS_DIR,
  // Si la librería lo permite, pasas el agente:
  agent
});

export default afip;
