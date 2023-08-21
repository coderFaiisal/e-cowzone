import cors from 'cors';
import express, { Application } from 'express';
import routes from './app/routes';

const app: Application = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

export default app;
