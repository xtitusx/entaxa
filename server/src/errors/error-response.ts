import { HttpStatusCode } from '@utils/http-status-code';

/**
 * @class ErrorResponse
 * @description Une classe qui :
 * - sert à définir des erreurs statiques, prédéfinies (StaticErrorResponse).
 * - peut être étendue pour construire des erreurs dynamiques.
 */
export class ErrorResponse {
    protected key: string;
    protected description: string;
    protected status: HttpStatusCode;
    protected success: boolean;

    public constructor(key: any, description?: string, status?: number) {
        this.key = key;
        this.description = description;
        this.status = status;
        this.success = false;
    }

    public getKey() {
        return this.key;
    }

    public getDescription() {
        return this.description;
    }

    public getStatus() {
        return this.status;
    }

    public isSuccess() {
        return this.success;
    }
}
