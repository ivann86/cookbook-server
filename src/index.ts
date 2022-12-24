import path from 'path';
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
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

declare global {
  var appRoot: string;
}

global.appRoot = path.resolve(__dirname);

config();

const PORT = process.env.PORT || 3000;

const users = createUsersCollection(createUserStore());
const recipes = createRecipesCollection(createRecipeStore());
const invalidTokens = createInvalidTokensStore();
const apiOtions = { jwtSecret: 'hf944s9ssaq', jwtExpiresIn: 3600 };
const cookbookApi = api(users, recipes, invalidTokens, apiOtions);

const app = express();
app.enable('trust proxy');

// CORS
app.use(cors({ origin: [/\.ivanoff\.dev$/, /cookbook-ng\.ml$/] }));

// Helmet ()
// app.use(helmet());

// Rate limit on api requests
app.use('/api', rateLimit({ windowMs: 10000, max: 30, standardHeaders: true, legacyHeaders: false }));

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'static')));
app.use('/api/v1/', cookbookApi);
const server = http.createServer(app);

configMongoose(process.env.MONGODB_CONNECTION_STRING!, undefined);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
