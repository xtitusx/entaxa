import { DbClientType } from '../models/db-client/db-client-type';

const dbConfig = {
    dbClient: DbClientType.TYPEGOOSE,
    mongoDb: {
        connectionOptions: {
            reconnectTries: Number.MAX_VALUE,
            poolSize: 5,
            bufferMaxEntries: 0,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            useCreateIndex: true,
            useFindAndModify: false,
            autoReconnect: true,
            autoIndex: false,
        },
    },
};

export default dbConfig;
