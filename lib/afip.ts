import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const CERT_PATH = '/tmp/arca.crt';
const KEY_PATH  = '/tmp/arca.key';

fs.writeFileSync(CERT_PATH, process.env.ARCA_WS_CRT!);
fs.writeFileSync(KEY_PATH,  process.env.ARCA_WS_KEY!);

const afip = new Afip({
  cuit: Number(process.env.CUIT),
  key: KEY_PATH,
  cert: CERT_PATH,
  production: true
});

export default afip;
