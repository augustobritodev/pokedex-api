import morgan, { StreamOptions } from 'morgan';
import Logger from '@src/config/logger';

const stream: StreamOptions = {
  write: message => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const morganConfig = morgan(':method :url :status :res[content-length] - :response-time ms - :remote-addr', {
  stream,
  skip,
});

export default morganConfig;
