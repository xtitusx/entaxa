import { Router } from 'express';
import { helloworldRoute } from './helloworld-route';
import { userRoute, usersRoute } from './user-route';

export class IndexRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public routes(): any {
        /** Routes à utiliser */
        this.router.use('/helloworld', helloworldRoute.router);
        this.router.use('/user', userRoute.router);
        this.router.use('/users', usersRoute.router);
        /** Route principal / état serveur */
        this.router.get('/', (req, res) => {
            let version = '0';
            let error = false;
            try {
                version = require('../../package.json').version;
            } catch (err) {
                error = true;
                console.log(err);
            }
            res.json({
                version,
                error,
                message: 'Entaxa server is running...',
            });
        });

        /** Routes catch-all 404 errors */
        this.router.all('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Route not found',
            });
        });
    }
}

const indexRoute = new IndexRoute();

export { indexRoute };
