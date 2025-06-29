import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const TICKETS_DIR = '/tmp/afip-tickets';

if (!fs.existsSync(TICKETS_DIR)) {
  fs.mkdirSync(TICKETS_DIR, { recursive: true });
}

dotenv.config();

const key = fs.readFileSync(path.resolve(process.cwd(), 'certs/clave.key')).toString();
const cert = fs.readFileSync(path.resolve(process.cwd(), 'certs/certificado.crt')).toString();

const afip = new Afip({
  cuit: Number(process.env.CUIT),
  key: key,
  cert: cert,
  production: true,
  ticketPath: TICKETS_DIR
});

export default afip;
