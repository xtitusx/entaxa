import moment = require('moment');
import { DbClient } from './db-client';
import { DbStorage } from '../db-storage/db-storage';
import commonConfig from '../../config/common-config';

/**
 * @description Un singleton contenant une instance de 'DbClient'.
 * @class DbClientCache
 */
export class DbClientCache {
    private static INSTANCE: DbClientCache;

    /**
     * Minutes
     */
    public static readonly DURATION: number = commonConfig.dbClientCache.duration;

    private constructor() {}

    private dbClient: DbClient<DbStorage>;
    private lastCallDate: moment.Moment;

    public static getInstance(): DbClientCache {
        if (!DbClientCache.INSTANCE) {
            DbClientCache.INSTANCE = new DbClientCache();
        }

        return DbClientCache.INSTANCE;
    }

    public getDbClient() {
        return this.dbClient;
    }

    public setDbClient(dbClient: DbClient<DbStorage>) {
        this.dbClient = dbClient;
    }

    /**
     * Méthode qui rafraîchit l'horodatage du dernier appel.
     */
    public refreshLastCallDate() {
        this.lastCallDate = moment();
    }

    public hasExpired(): boolean {
        const expirationDate = moment(this.lastCallDate).add(DbClientCache.DURATION, 'minute');

        if (moment().isAfter(expirationDate)) {
            return true;
        }
        return false;
    }
}
