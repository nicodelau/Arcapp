import { Afip } from "afip.ts";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const cert = Buffer.from(process.env.ARCA_WS_CRT_B64!, 'base64').toString('utf8');
const key  = Buffer.from(process.env.ARCA_WS_KEY_B64!, 'base64').toString('utf8');

const afip = new Afip({
  production: true,
  cuit:    +process.env.CUIT!,
  cert,
  key,
});

export default afip;
