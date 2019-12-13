import dbConfig from '@config/db-config';

import { DbClient } from '@models/db-client/db-client';
import { DbClientCache } from '@models/db-client/db-client-cache';
import { DbClientFactory } from '@models/db-client/db-client-factory';
import { DbStorage } from '@models/db-storage/db-storage';

import { LoggerWrapper, LogLevel } from '@utils/logger';

type EtatNettoyage = 'DEBUT' | 'FIN';

/**
 * @class DbClientService
 */
export class DbClientService {
    private static readonly DB_CLIENT_CACHE = DbClientCache.getInstance();

    constructor() {
        // Nullary constructor
    }

    /**
     * Méthode qui nettoie le cache contenant une instance de 'DbClient'.
     * @param needGracefulShutdown boolean (optionnel).
     */
    public static cleanDbClientCache(needGracefulShutdown?: boolean) {
        const logger: LoggerWrapper = new LoggerWrapper();

        DbClientService.log(logger, 'DEBUT');

        let openedDbClient: boolean;
        let deletedDbClient: boolean;

        if (!DbClientService.DB_CLIENT_CACHE.getDbClient()) {
            openedDbClient = false;
            deletedDbClient = false;
        } else if (DbClientService.DB_CLIENT_CACHE.hasExpired() || needGracefulShutdown) {
            DbClientService.DB_CLIENT_CACHE.getDbClient().closeConnection();
            DbClientService.DB_CLIENT_CACHE.setDbClient(undefined);
            openedDbClient = false;
            deletedDbClient = true;
        } else {
            openedDbClient = true;
            deletedDbClient = false;
        }

        logger.log(LogLevel.INFO, `Connexion ouverte = ${openedDbClient} / Connexion nettoyée = ${deletedDbClient}`);

        DbClientService.log(logger, 'FIN');
    }

    /**
     * Méthode qui retourne une instance mise en cache de 'DbClient' :
     * @return Promise<DbClient<DbStorage>>
     */
    public getDbClient(): Promise<DbClient<DbStorage>> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!DbClientService.DB_CLIENT_CACHE.getDbClient()) {
                    DbClientService.DB_CLIENT_CACHE.setDbClient(
                        await DbClientFactory.getInstance().create(dbConfig.dbClient)
                    );
                }
                DbClientService.DB_CLIENT_CACHE.refreshLastCallDate();
                resolve(DbClientService.DB_CLIENT_CACHE.getDbClient());
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @param logger LoggerWrapper
     * @param etat EtatNettoyage
     * @return void
     */
    private static log(logger: LoggerWrapper, etat: EtatNettoyage) {
        logger.log(LogLevel.INFO, `Nettoyage du cache contenant dbClient : ${etat}`);
    }
}
