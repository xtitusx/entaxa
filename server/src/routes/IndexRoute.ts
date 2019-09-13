import { Router } from 'express';
import { helloworldRoute } from './HellowordRoute';

export class IndexRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    public routes(): any {
        // TODO : Supprimer dès que le logger Morgan est mis en place.
        this.router.use(
            '*',
            (req, res, next) => {
                console.log('Request URL:', req.originalUrl);
                next();
            },

            (req, res, next) => {
                console.log('Request Type:', req.method);
                next();
            }
        );

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

export default new IndexRoute();
