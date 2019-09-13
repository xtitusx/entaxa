import chalk from 'chalk';
import express from 'express';
import * as http from 'http';

import IndexRoute from './routes/IndexRoute';

/**
 * @class Server
 */
class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {}

    private routes() {
        this.app.use(IndexRoute.router);
    }
}
export default new Server();
const port = normalizePort(process.env.PORT || 3000);

const server = http.createServer(new Server().app.set('port', port));
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('connection', (socket) => {
    console.log('A new connection was made by a client.');
    socket.setTimeout(720 * 1000);
    // 30 second timeout. Change this as you see fit.
});

/**
 * Fonction qui normalise/formate la valeur du port
 * @param val
 */
function normalizePort(val: number | string): number | string | boolean {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

/**
 * Fonction qui permet la gestion des erreurs lors du lancement du serveur
 * @param error
 */
function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Fonction qui permet le lancement du serveur sur une adresse et un port spécifiques et qui attend des requêtes
 */
function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log('\n');
    if (process.env.NODE_ENV) {
        console.log(
            chalk.blueBright(
                `####################### ENV : ${process.env.NODE_ENV.toUpperCase()} #######################`
            )
        );
    } else {
        console.log(chalk.blueBright(`####################### ENV : ????? #######################`));
    }
    console.log('\n');
    console.log('[server] - Node server listening on ' + chalk.blueBright(bind));
}
