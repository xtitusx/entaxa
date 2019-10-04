import { Router } from 'express';
import { helloworldRoute } from './helloworld-route';

export class IndexRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public routes(): any {
        /** Routes à utiliser */
        this.router.use('/helloworld', helloworldRoute.router);
        /** Route principal / status serveur */
        this.router.get('/', (req, res) => {
            res.status(200).json({
                success: true,
                message: process.env.npm_package_name + ' v' + process.env.npm_package_version,
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
