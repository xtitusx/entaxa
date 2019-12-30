import { Request, Response, Router, NextFunction } from 'express';

import { Typegoose } from '@models/db-client/typegoose/typegoose';
import { DbClient } from '@models/db-client/db-client';
import { UserService } from '@services/user-service';
import { DbClientService } from '@services/db-client-service';
import { HttpStatusCode } from '@utils/http-status-code';
import { LoggerWrapper, LogLevel } from '@utils/Logger';

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
        new UserService(<DbClient<any>>(<any>req).dbClient)
            .getUser(req.params.id)
            .then((user) => {
                res.json({
                    code: HttpStatusCode.OK,
                    success: true,
                    message: user,
                });
            })
            .catch((err) => {
                next(err);
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
