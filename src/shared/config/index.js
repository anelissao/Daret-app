import dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

class Config {
  get port() {
    return Number(process.env.PORT || 4000);
  }

  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  }

  get isDev() {
    return this.nodeEnv !== 'production';
  }

  get mongoUri() {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/daret_api';
  }

  get jwt() {
    return {
      secret: process.env.JWT_SECRET || 'change_me',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      issuer: process.env.JWT_ISSUER || 'daret-api',
    };
  }
}

export const config = new Config();
