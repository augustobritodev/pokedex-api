import path from 'path';
import winston from 'winston';
import Rotate from 'winston-daily-rotate-file';
import { LOG } from '@src/config/env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const label = path.basename(String(require.main?.filename));

const formatConsole = winston.format.combine(
  winston.format.label({ label }),
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => `[LOG] ${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
);

const formatFile = winston.format.combine(
  winston.format.label({ label }),
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
);

const consoleTransport = new winston.transports.Console({
  format: formatConsole,
});

const rotateDebugTransport = new Rotate({
  filename: '%DATE%.log',
  format: formatFile,
  dirname: LOG.debugDirname,
  datePattern: LOG.datePattern,
  maxFiles: LOG.maxFiles,
  maxSize: LOG.maxSize,
});

const rotateErrorTransport = new Rotate({
  filename: '%DATE%.log',
  format: formatFile,
  dirname: LOG.errorDirname,
  datePattern: LOG.datePattern,
  maxFiles: LOG.maxFiles,
  maxSize: LOG.maxSize,
});

rotateErrorTransport.on('rotate', (oldFilename, newFilename) => {
  // TODO: Logs can be sent or uploaded to a server
});

const Logger = winston.createLogger({
  levels,
  level: level(),
  transports: [consoleTransport, rotateDebugTransport, rotateErrorTransport],
});

export default Logger;
