import { DbClientType } from '@models/db-client/db-client-type';

const dbConfig = {
    dbClient: DbClientType.TYPEGOOSE,
    mongoDb: {
        connectionOptions: {
            reconnectTries: 3,
            poolSize: 5,
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            useCreateIndex: true,
            useFindAndModify: false,
            autoReconnect: false,
            autoIndex: false,
            useUnifiedTopology: true,
        },
    },
};

export default dbConfig;
