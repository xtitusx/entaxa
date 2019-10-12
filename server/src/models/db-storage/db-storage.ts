/**
 * @class DbStorage
 */
export abstract class DbStorage {
    private host: string;
    private port: number;
    private protocol: string;
    private database: string;
    private user: string;
    private password: string;
    private uri: string;

    public constructor(host: string, port: number, protocol: string, database: string, user: string, password: string) {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
        this.database = database;
        this.user = user;
        this.password = password;
    }

    public getHost() {
        return this.host;
    }

    public setHost(host: string) {
        this.host = host;
    }

    public getPort() {
        return this.port;
    }

    public setPort(port: number) {
        this.port = port;
    }

    public getProtocol() {
        return this.protocol;
    }

    public setProtocol(protocol: string) {
        this.protocol = protocol;
    }

    public getDatabase() {
        return this.database;
    }

    public setDatabase(database: string) {
        this.database = database;
    }

    public getUser() {
        return this.user;
    }

    public setUser(user: string) {
        this.user = user;
    }

    public getPassword() {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getUri() {
        return this.uri;
    }

    public setUri(uri: string) {
        this.uri = uri;
    }
}
