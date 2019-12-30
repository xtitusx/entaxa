import { DbStorage } from './db-storage';

/**
 * @description Configuration MongoDB.
 * @class MongoDbStorage
 * @extends {DbStorage}
 */
export class MongoDbStorage extends DbStorage {
    private useNewUrlParser: boolean;

    public constructor(host: string, port: number, protocol: string, database: string, user: string, password: string) {
        super(host, port, protocol, database, user, password);
        this.init();
    }

    private init() {
        this.setUri(`${this.getProtocol()}://${this.getHost()}:${this.getPort()}/${this.getDatabase()}`);

        this.setUriWithCreds(
            this.getUser() && this.getPassword()
                ? `${this.getProtocol()}://${this.getUser()}:${this.getPassword()}@${this.getHost()}:${this.getPort()}/${this.getDatabase()}`
                : this.getUri()
        );

        this.useNewUrlParser = true;
    }

    public hasNewUrlParser() {
        return this.useNewUrlParser;
    }

    public setNewUrlParser(useNewUrlParser: boolean) {
        this.useNewUrlParser = useNewUrlParser;
    }
}
