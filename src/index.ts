import express, { Application } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

import 'dotenv/config'

import { logger } from "./logger";
import intercomRoutes from './routes/intercom';
import articlesRoutes from './routes/articles';

const log = logger(__filename);

const server: Application = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/intercom', intercomRoutes);
server.use('/articles', articlesRoutes);

server.listen(process.env.PORT, () => {
  log.info("Your app is listening on port " + process.env.PORT);
});


