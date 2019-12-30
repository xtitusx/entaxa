import express from 'express';

import { DbClientService } from '@services/db-client-service';

/**
 * Middleware qui surcharge req.dbClient avec une instance de 'DbClient' avant de passer au middleware suivant.
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export const dbClientMiddleware: express.RequestHandler = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    new DbClientService()
        .getDbClient()
        .then((dbClient) => {
            (<any>req).dbClient = dbClient;
            next();
        })
        .catch((err) => {
            next(err);
        });
};
