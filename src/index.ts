import http from 'http';
import express from 'express';
import * as dotenv from 'dotenv';
import { api } from './api';
import { createUsersCollection } from './users';
import { createUsersStore } from './database';

// dotenv.config();

const PORT = process.env.PORT || 3000;

const users = createUsersCollection(createUsersStore());
const cookbookApi = api(users);
const app = express();

app.use('/api/v1/', cookbookApi);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
