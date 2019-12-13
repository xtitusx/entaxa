import mongodb = require('mongodb');

import dbConfig from '@config/db-config';

import { DbClient } from '@models/db-client/db-client';
import { MongoDbStorage } from '@models/db-storage/mongo-db-storage';

/**
 * @class MongoClient
 * @extends {DbClient}
 */
export class MongoClient extends DbClient<MongoDbStorage> {
    public constructor(storageConfig: MongoDbStorage) {
        super(storageConfig);
    }

    /**
     * @override
     */
    public createConnection(): Promise<mongodb.MongoClient> {
        return new Promise(async (resolve: Function, reject: Function) => {
            try {
                let mongoClientOptions: mongodb.MongoClientOptions = {};
                mongoClientOptions.auth = {
                    user: this.getDbStorage().getUser(),
                    password: this.getDbStorage().getPassword(),
                };
                mongoClientOptions.useNewUrlParser = this.getDbStorage().hasNewUrlParser();
                mongoClientOptions.reconnectTries = dbConfig.mongoDb.connectionOptions.reconnectTries;
                mongoClientOptions.poolSize = dbConfig.mongoDb.connectionOptions.poolSize;
                mongoClientOptions.bufferMaxEntries = dbConfig.mongoDb.connectionOptions.bufferMaxEntries;
                mongoClientOptions.connectTimeoutMS = dbConfig.mongoDb.connectionOptions.connectTimeoutMS;
                mongoClientOptions.socketTimeoutMS = dbConfig.mongoDb.connectionOptions.socketTimeoutMS;
                mongoClientOptions.family = <any>dbConfig.mongoDb.connectionOptions.family;
                mongoClientOptions.useUnifiedTopology = dbConfig.mongoDb.connectionOptions.useUnifiedTopology;

                resolve(new mongodb.MongoClient(this.getDbStorage().getUri(), mongoClientOptions).connect());
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @override
     */
    public closeConnection(): Promise<void> {
        return (<mongodb.MongoClient>this.connection).close();
    }

    /**
     * @override
     */
    public getReadyState(): number {
        return (<mongodb.MongoClient>this.connection).isConnected() ? 1 : 0;
    }
}
