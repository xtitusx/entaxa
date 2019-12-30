import { IDaoAdapter } from './i-dao-adapter';
import { DbClient } from '@models/db-client/db-client';
import { IUser } from '@dto/user';
import { LoggerWrapper } from '@utils/logger';

/**
 * @description Une classe :
 * - Liée à une instance de DbClient.
 * - Gérant tous les DAO accessibles via des accesseurs.
 *
 * Chaque DAO est créé à la demande (lazily initialization).
 * @class DaoManager
 */
export abstract class DaoManager<T extends DbClient<any>> {
    private readonly dbClient: T;
    private logger: LoggerWrapper;

    protected userDao: IDaoAdapter<IUser>;

    constructor(dbClient: T) {
        this.dbClient = dbClient;
        this.init();
    }

    public getDbClient() {
        return this.dbClient;
    }

    public getLogger() {
        return this.logger;
    }

    private init() {
        this.logger = new LoggerWrapper();
    }

    public abstract getUserDao(): IDaoAdapter<IUser>;
}
