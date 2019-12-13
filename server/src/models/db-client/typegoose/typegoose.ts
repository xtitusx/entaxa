import mongoose = require('mongoose');
import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';

import { User } from './schemas/user';

import dbConfig from '@config/db-config';

import { DbClient } from '@models/db-client/db-client';
import { IModel } from '@models/db-client/i-model';
import { MongoDbStorage } from '@models/db-storage/mongo-db-storage';

/**
 * @class Typegoose
 * @extends {DbClient}
 */
export class Typegoose extends DbClient<MongoDbStorage> implements IModel {
    private userModel: ReturnModelType<new () => User, unknown>;

    public constructor(storageConfig: MongoDbStorage) {
        super(storageConfig);
    }

    /**
     * @override
     */
    public createConnection(): Promise<mongoose.Connection> {
        return new Promise(async (resolve: Function, reject: Function) => {
            try {
                let connectionOptions: mongoose.ConnectionOptions = {};

                connectionOptions.user = this.getDbStorage().getUser();
                connectionOptions.pass = this.getDbStorage().getPassword();
                connectionOptions.useNewUrlParser = this.getDbStorage().hasNewUrlParser();
                connectionOptions.useCreateIndex = dbConfig.mongoDb.connectionOptions.useCreateIndex;
                connectionOptions.useFindAndModify = dbConfig.mongoDb.connectionOptions.useFindAndModify;
                connectionOptions.autoReconnect = dbConfig.mongoDb.connectionOptions.autoReconnect;
                connectionOptions.autoIndex = dbConfig.mongoDb.connectionOptions.autoIndex;
                connectionOptions.reconnectTries = dbConfig.mongoDb.connectionOptions.reconnectTries;
                connectionOptions.poolSize = dbConfig.mongoDb.connectionOptions.poolSize;
                connectionOptions.bufferMaxEntries = dbConfig.mongoDb.connectionOptions.bufferMaxEntries;
                connectionOptions.connectTimeoutMS = dbConfig.mongoDb.connectionOptions.connectTimeoutMS;
                connectionOptions.socketTimeoutMS = dbConfig.mongoDb.connectionOptions.socketTimeoutMS;
                connectionOptions.family = <any>dbConfig.mongoDb.connectionOptions.family;
                connectionOptions.useUnifiedTopology = dbConfig.mongoDb.connectionOptions.useUnifiedTopology;

                resolve(mongoose.createConnection(this.getDbStorage().getUri(), connectionOptions));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @override
     */
    public closeConnection(): Promise<void> {
        return (<mongoose.Connection>this.connection).close();
    }

    /**
     * @override
     */
    public getReadyState(): number {
        return (<mongoose.Connection>this.connection).readyState;
    }

    /**
     * @override
     */
    public createModels(): void {
        this.userModel = this.getModelForClass(User);
    }

    /**
     * @override
     */
    public getUserModel() {
        return this.userModel;
    }

    /**
     * Méthode qui récupère un modèle à partir d'une classe.
     * @param clazz <T>(clazz: { new(): T }
     * @param schemaOptions mongoose.SchemaOptions (optionnel)
     * @return ReturnModelType<new () => T, unknown>
     */
    private getModelForClass<T>(clazz: { new (): T }, schemaOptions?: mongoose.SchemaOptions) {
        if (!schemaOptions) {
            return getModelForClass(clazz, { existingConnection: this.connection });
        }
        return getModelForClass(clazz, { existingConnection: this.connection, schemaOptions });
    }
}
