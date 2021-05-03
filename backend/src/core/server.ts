import express from 'express';
import dotenv from 'dotenv-safe';
import { User } from '@src/models/User';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(3333);
