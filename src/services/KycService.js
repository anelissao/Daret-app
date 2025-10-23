import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config } from '../shared/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_ROOT = path.resolve(__dirname, '../../storage/kyc');

const ensureDir = () => {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
};

export class KycService {
  constructor() {
    ensureDir();
    this.key = this._getKey();
  }

  _getKey() {
    const raw = process.env.KYC_ENCRYPTION_KEY || '';
    const buf = raw && raw.length === 64 ? Buffer.from(raw, 'hex') : Buffer.from(raw, 'utf8');
    if (buf.length !== 32) {
      throw new Error('KYC_ENCRYPTION_KEY must be 32 bytes (hex-encoded recommended)');
    }
    return buf;
  }

  async encryptAndStore(userId, field, buffer, mimetype) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const enc = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const tag = cipher.getAuthTag();

    const filename = `${userId}-${field}-${Date.now()}.enc`;
    const filePath = path.join(STORAGE_ROOT, filename);
    const header = JSON.stringify({ iv: iv.toString('hex'), tag: tag.toString('hex'), mimetype });
    const content = Buffer.concat([Buffer.from(header + '\n'), enc]);
    await fs.promises.writeFile(filePath, content);
    return { filename };
  }

  async getStatusFiles(user) {
    const files = [];
    if (user.kyc?.idFront?.file) files.push(user.kyc.idFront.file);
    if (user.kyc?.idBack?.file) files.push(user.kyc.idBack.file);
    if (user.kyc?.selfie?.file) files.push(user.kyc.selfie.file);
    return files;
  }
}
