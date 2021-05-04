import dotenv from 'dotenv-safe';

// Read .env from specified path
if (process.env.NODE_ENV === 'production') {
  // dotenv.config({ path: '../../usr/local/etc/gooScp/.env' });
  dotenv.config();
} else {
  // dotenv.config({ path: DEV_ENV });
  dotenv.config();
}

const SERVER = {
  hostname: process.env.SERVER_HOSTNAME || '0.0.0.0',
  port: Number(process.env.SERVER_PORT) || 3333,
};

const API = {
  prefix: process.env.API_PREFIX || '/api',
};

const DATABASE = {
  user: process.env.DATABASE_USER || 'goo',
  password: process.env.DATABASE_PASSWORD || 'goopw',
  host: process.env.DATABASE_HOST || '10.254.122.241',
  port: Number(process.env.DATABASE_PORT) || 5432,
  name: process.env.DATABASE_NAME || 'goobeta',
  connections: Number(process.env.DATABASE_CONNECTIONS) || 20,
  timeout: Number(process.env.DATABASE_TIMEOUT) || 0,
  idle: Number(process.env.DATABASE_IDLE) || 0,
};

const LOG = {
  debugDirname: process.env.LOG_DEBUG_DIRNAME || 'logs/debug',
  errorDirname: process.env.LOG_ERROR_DIRNAME || 'logs/error',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '1d',
  maxSize: '1m',
};

export { SERVER, API, DATABASE, LOG };
