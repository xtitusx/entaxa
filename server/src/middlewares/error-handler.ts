import chalk from 'chalk';
import express from 'express';

import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';
import { LoggerWrapper, LogLevel } from '@utils/logger';

/**
 * Gestionnaire d'erreurs.
 * @param err any
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export const errorHandler: express.ErrorRequestHandler = (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    let errorWrapper: ErrorWrapper;

    if (err instanceof ErrorWrapper) {
        errorWrapper = <ErrorWrapper>err;
    } else {
        errorWrapper = new ErrorWrapper(StaticErrorResponse.UNKNOWN_ERROR, err);
    }
    const errorResponse = errorWrapper.getErrorResponse();
    new LoggerWrapper().log(LogLevel.ERROR, chalk.bold.red(`${errorWrapper.getLogMessage()}`));

    res.status(errorResponse.getStatus()).json({
        success: errorResponse.isSuccess(),
        key: errorResponse.getKey(),
        description: errorResponse.getDescription(),
        message: errorWrapper.message,
    });
};
