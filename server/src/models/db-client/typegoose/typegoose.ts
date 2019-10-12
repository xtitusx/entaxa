import mongoose = require('mongoose');
import { Typegoose as typegoose } from '@hasezoey/typegoose';
import { DbClient } from '../db-client';
import { IModel } from '../i-model';
import { MongoDbStorage } from '../../db-storage/mongo-db-storage';
import dbConfig from '../../../config/db-config';
import { User } from './schemas/user';

/**
 * @class Typegoose
 * @extends {DbClient}
 */
export class Typegoose extends DbClient<MongoDbStorage> implements IModel {
    private userModel: mongoose.Model<InstanceType<any>, {}> & typegoose;

    public constructor(storageConfig: MongoDbStorage) {
        super(storageConfig);
    }

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
                connectionOptions.useUnifiedTopology = true;

                resolve(mongoose.createConnection(this.getDbStorage().getUri(), connectionOptions));
            } catch (err) {
                reject(err);
            }
        });
    }

    public closeConnection(): Promise<void> {
        // FIXME
        return (<mongoose.Connection>this.connection).close();
    }

    public getReadyState(): number {
        return (<mongoose.Connection>this.connection).readyState;
    }

    public createModels(): void {
        this.userModel = this.getModelForClass(User);
    }

    public getUserModel() {
        return this.userModel;
    }

    /**
     * Méthode d'instanciation d'un modèle.
     * @param clazz <T extends typegoose>(clazz: { new(): T }
     * @param schemaOptions (optionnel) mongoose.SchemaOptions
     * @return mongoose.Model<InstanceType<any>, {}> & typegoose & typeof clazz
     */
    private getModelForClass<T extends typegoose>(
        clazz: { new (): T },
        schemaOptions?: mongoose.SchemaOptions
    ): mongoose.Model<InstanceType<any>, {}> & typegoose & typeof clazz {
        if (!schemaOptions) {
            return new clazz().getModelForClass(clazz, { existingConnection: this.connection });
        }
        return new clazz().getModelForClass(clazz, { existingConnection: this.connection, schemaOptions });
    }
}
