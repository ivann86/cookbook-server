import http from 'http';
import express from 'express';
import { config } from 'dotenv';
import { api } from './api';
import { createUsersCollection } from './users';
import { createInvalidTokensStore, createRecipeStore, createUserStore } from './database';
import { createRecipesCollection } from './recipe';
import { configMongoose } from './database/config';
import morgan from 'morgan';
import cors from 'cors';

config();

const PORT = process.env.PORT || 3000;

const users = createUsersCollection(createUserStore());
const recipes = createRecipesCollection(createRecipeStore());
const invalidTokens = createInvalidTokensStore();
const apiOtions = { jwtSecret: 'hf944s9ssaq', jwtExpiresIn: 3600 };
const cookbookApi = api(users, recipes, invalidTokens, apiOtions);

const app = express();
app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use(morgan('combined'));
app.use('/api/v1/', cookbookApi);
const server = http.createServer(app);

configMongoose(process.env.MONGODB_CONNECTION_STRING!, undefined);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
