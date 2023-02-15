import express, { json, static as _static } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES, ORIGIN_PATH } from './helpers/index.js';
import router from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(
  cors({
    origin: ORIGIN_PATH,
    credentials: true,
  })
);
app.use(json());
app.use(ROUTES.IMAGES_ROUTES, _static(join(__dirname, 'images')));

app.use(ROUTES.ROUTER_BASE, router);

app.get(ROUTES.BASE, (req, res) => {
  res.send('Welcome to api');
});

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connection established'))
  .catch((err) =>
    console.error(`MongoDB connection is failed: ${err.message}`)
  );
