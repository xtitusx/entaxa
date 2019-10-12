import { Request, Response, Router, NextFunction } from 'express';
import { DbClientService } from '../services/db-client-service';
import { Typegoose } from '../models/db-client/typegoose/typegoose';
import { LoggerWrapper, LogLevel } from '../utils/Logger';

class UserRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.get('/:id', this.getUser);
    }

    /**
     * Méthode qui renvoie un utilisateur.
     * @param req
     * @param res
     */
    public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const logger: LoggerWrapper = new LoggerWrapper();

        const dbClient = <Typegoose>await new DbClientService().getDbClient();

        dbClient
            .getUserModel()
            .findById(req.params.id)
            .then((user) => {
                res.json({
                    code: 200,
                    success: true,
                    message: user,
                });
            })
            .catch((err) => {
                /** Erreur pendant une opération de la chaîne de Promises */
                logger.log(LogLevel.ERROR, `${err.message}`);
                res.status(404).json({
                    success: false,
                    message: err.message,
                });
            });
    }
}

class UsersRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('', this.createUser);
    }

    /**
     * Méthode qui enregistre un utilisateur.
     * @param req
     * @param res
     */
    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const logger: LoggerWrapper = new LoggerWrapper();

        const dbClient = <Typegoose>await new DbClientService().getDbClient();

        dbClient
            .getUserModel()
            .create(req.body)
            .then((user) => {
                res.json({
                    code: 201,
                    success: true,
                    message: user,
                });
            })
            .catch((err) => {
                /** Erreur pendant une opération de la chaîne de Promises */
                logger.log(LogLevel.ERROR, `${err.message}`);
                res.status(404).json({
                    success: false,
                    message: err.message,
                });
            });
    }
}

const userRoute = new UserRoute();
const usersRoute = new UsersRoute();

export { userRoute, usersRoute };
