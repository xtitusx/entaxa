import { MongoClientDaoManager } from './mongo-client/common/mongo-client-dao-manager';
import { MongooseDaoManager } from './mongoose/common/mongoose-dao-manager';
import dbConfig from '@config/db-config';
import { DbClient } from '@models/db-client/db-client';
import { DbClientType } from '@models/db-client/db-client-type';
import { Mongoose } from '@models/db-client/mongoose/mongoose';
import { Typegoose } from '@models/db-client/typegoose/typegoose';
import { EnumUtils } from '@utils/enum-utils';

/**
 * @description Un singleton fabriquant des instances héritant de DaoManager.
 * @class DaoManagerFactory
 */
export class DaoManagerFactory {
    private static INSTANCE: DaoManagerFactory;

    private constructor() {}

    public static getInstance(): DaoManagerFactory {
        if (!DaoManagerFactory.INSTANCE) {
            DaoManagerFactory.INSTANCE = new DaoManagerFactory();
        }

        return DaoManagerFactory.INSTANCE;
    }

    /**
     * Méthode qui instancie une classe héritant de DaoManager.
     * @param dbClient DbClient<any>
     * @return MongoClientDaoManager | MongooseDaoManager
     * @throws {RangeError} Si la valeur de la variable d'environnement "db-config.dbClient" dans "config/db-config.ts" est incorrecte ou non gérée.
     */
    public create(dbClient: DbClient<any>): MongoClientDaoManager | MongooseDaoManager {
        switch (dbConfig.dbClient) {
            case DbClientType.MONGOCLIENT: {
                return new MongoClientDaoManager(dbClient);
            }
            case DbClientType.MONGOOSE: {
                return new MongooseDaoManager(<Mongoose>dbClient);
            }
            case DbClientType.TYPEGOOSE: {
                return new MongooseDaoManager(<Typegoose>dbClient);
            }
            default: {
                EnumUtils.validate(DbClientType, dbConfig.dbClient);
                throw new RangeError(
                    `L'évaluation de l'expression 'dbConfig.dbClient' n'a pas de cas associé au résultat obtenu '${dbConfig.dbClient}'`
                );
            }
        }
    }
}
