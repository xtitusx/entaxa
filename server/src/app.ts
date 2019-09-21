import express from 'express';
import { indexRoute } from './routes/IndexRoute';

const app = express();
middleware();
routes();

function middleware() {}

function routes() {
    app.use(indexRoute.router);
}

export default app;
