import express from 'express';
import cors from 'cors';
import log from './logger';
import connect from './db/connect';
import routes from './routes';

require('dotenv').config();

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  log.info(`Server listing at ${port}`);
  connect();
  routes(app);
});
