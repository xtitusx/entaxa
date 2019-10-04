import { Request, Response, Router } from 'express';

class HelloworldRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('', this.helloworld);
    }

    /**
     * Méthode qui renvoie un HelloWorld.
     * @param req
     * @param res
     */
    public helloworld(req: Request, res: Response): void {
        res.json({
            code: 200,
            success: true,
            message: 'Hello world!',
        });
    }
}

const helloworldRoute = new HelloworldRoute();

export { helloworldRoute };
