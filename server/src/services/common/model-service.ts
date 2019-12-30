import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';
import { DbClient } from '@models/db-client/db-client';
import { DaoManagerFactory } from '@dao/dao-manager-factory';
import { DaoManager } from '@dao/common/dao-manager';

/**
 * @description Un service accédant à la couche Modèle via un DaoManager.
 * @class ModelService
 */
export abstract class ModelService {
    private dbClient: DbClient<any>;
    private daoManager: DaoManager<any>;

    constructor(dbClient: DbClient<any>) {
        this.dbClient = dbClient;
    }

    /**
     * @throws {ErrorResponse.SERVICE_MODEL}
     */
    protected init() {
        try {
            this.daoManager = DaoManagerFactory.getInstance().create(this.dbClient);
        } catch (err) {
            throw new ErrorWrapper(StaticErrorResponse.SERVICE_MODEL, err);
        }
    }

    protected getDbClient() {
        return this.dbClient;
    }

    protected getDaoManager() {
        return this.daoManager;
    }
}
