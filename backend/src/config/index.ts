import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sms',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '30d',
  },

  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    uploadMaxMb: parseInt(process.env.UPLOAD_MAX_MB || '50', 10),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },

  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
};


