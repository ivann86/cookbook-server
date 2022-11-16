import http from 'http';
import express from 'express';
import * as dotenv from 'dotenv';
import { api } from './api';
import { UsersCollection } from './users';
import { dataService } from './database';

// dotenv.config();

const PORT = process.env.PORT || 3000;

const userDataService = dataService();
const cookbookApi = api(UsersCollection(userDataService));
const app = express();

app.use('/api/v1/', cookbookApi);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
