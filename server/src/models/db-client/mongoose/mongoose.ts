import mongoose = require('mongoose');

import { userSchema } from './schemas/user';

import dbConfig from '@config/db-config';

import { DbClient } from '@models/db-client/db-client';
import { IModel } from '@models/db-client/i-model';
import { MongoDbStorage } from '@models/db-storage/mongo-db-storage';

/**
 * @class Mongoose
 * @extends {DbClient<MongoDbStorage>}
 * @implements {IModel}
 */
export class Mongoose extends DbClient<MongoDbStorage> implements IModel {
    private userModel: mongoose.Model<InstanceType<any>, {}>;

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
        this.userModel = this.getModelForModelName('user', userSchema);
    }

    /**
     * @override
     */
    public getUserModel() {
        return this.userModel;
    }

    /**
     * Méthode qui récupère un modèle à partir d'un nom de modèle.
     * @param {string} modelName
     * @param  {mongoose.Schema<any>} [schema]
     * @returns {mongoose.Model<InstanceType<any>, {}>}
     */
    private getModelForModelName(
        modelName: string,
        schema?: mongoose.Schema<any>
    ): mongoose.Model<InstanceType<any>, {}> {
        if (!schema) {
            return (<mongoose.Connection>this.getConnection()).model(modelName);
        }
        return (<mongoose.Connection>this.getConnection()).model(modelName, schema);
    }
}
