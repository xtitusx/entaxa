import { DbClient } from './db-client';
import { DbClientType } from './db-client-type';
import { IModel } from './i-model';
import { MongoClient } from './mongo-client/mongo-client';
import { Mongoose } from './mongoose/mongoose';
import { Typegoose } from './typegoose/typegoose';
import dbConfig from '@config/db-config';
import { MongoDbStorage } from '@models/db-storage/mongo-db-storage';
import { DbStorage } from '@models/db-storage/db-storage';
import { EnumUtils } from '@utils/enum-utils';

/**
 * @description Un singleton fabriquant des instances héritant de DbClient.
 * @class DbClientFactory
 */
export class DbClientFactory {
    private static INSTANCE: DbClientFactory;

    private constructor() {}

    public static getInstance(): DbClientFactory {
        if (!DbClientFactory.INSTANCE) {
            DbClientFactory.INSTANCE = new DbClientFactory();
        }

        return DbClientFactory.INSTANCE;
    }

    /**
     * Méthode qui instancie une classe héritant de DbClient.
     * @param {DbClientType} dbClientType
     * @returns {Promise<DbClient<DbStorage>>}
     * @throws {RangeError} Si la valeur de la variable d'environnement "db-config.dbClient" dans "config/db-config.ts" est incorrecte ou non gérée.
     */
    public async create(dbClientType: DbClientType): Promise<DbClient<DbStorage>> {
        let dbClient: DbClient<DbStorage>;

        const mongoDbStorage = new MongoDbStorage(
            process.env.MONGODB_HOST,
            parseInt(process.env.MONGODB_PORT),
            process.env.MONGODB_PROTOCOL,
            process.env.MONGODB_DATABASE,
            process.env.MONGODB_USER,
            process.env.MONGODB_PASSWORD
        );

        switch (dbClientType) {
            case DbClientType.MONGOCLIENT: {
                dbClient = new MongoClient(mongoDbStorage);
                break;
            }
            case DbClientType.MONGOOSE: {
                dbClient = new Mongoose(mongoDbStorage);
                break;
            }
            case DbClientType.TYPEGOOSE: {
                dbClient = new Typegoose(mongoDbStorage);
                break;
            }
            default: {
                EnumUtils.validate(DbClientType, dbConfig.dbClient);
                throw new RangeError(
                    `L'évaluation de l'expression 'dbConfig.dbClient' n'a pas de cas associé au résultat obtenu '${dbConfig.dbClient}'`
                );
            }
        }

        if (dbClient) {
            dbClient.setConnection(await dbClient.createConnection());

            try {
                (<IModel>(<any>dbClient)).createModels();
            } catch (err) {
                // Si une TypeError est levée, la classe n'implémente pas l'interface IModel.
                if (!(err instanceof TypeError)) {
                    throw err;
                }
            }
        }

        return dbClient;
    }
}
