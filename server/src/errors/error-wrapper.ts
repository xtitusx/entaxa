import { ErrorResponse } from './error-response';

/**
 * @description Enrobeur d'Error, enrichie des paramètres nécessaires à la construction de l'objet "Response".
 * @class ErrorWrapper
 * @extends {Error}
 */
export class ErrorWrapper extends Error {
    private errorResponse: ErrorResponse;

    constructor(errorResponse: ErrorResponse, ...err: any) {
        super(...err);
        this.errorResponse = errorResponse;
    }

    public getErrorResponse() {
        return this.errorResponse;
    }

    public getLogMessage() {
        return `${this.errorResponse.getDescription()} [${this.message}]`;
    }
}
