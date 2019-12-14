import { DbStorage } from '@models/db-storage/db-storage';

/**
 * @abstract
 * @class DbClient<T extends DbStorage>
 */
export abstract class DbClient<T extends DbStorage> {
    protected dbStorage: T;
    protected connection: any;

    constructor(dbStorage: T) {
        this.dbStorage = dbStorage;
    }

    protected getDbStorage() {
        return this.dbStorage;
    }

    public getConnection() {
        return this.connection;
    }

    public setConnection(connection: any) {
        this.connection = connection;
    }

    /**
     * Méthode qui crée une instance de connexion à la base de données.
     * @returns Promise<any>
     */
    public abstract createConnection(): Promise<any>;

    /**
     * Méthode qui clôt l'instance de connexion à la base de données.
     * @returns Promise<void>
     */
    public abstract closeConnection(): Promise<void>;

    /**
     * Méthode qui vérifie l'état de la connexion à la base de données :
     * - 0 = disconnected.
     * - 1 = connected.
     * - 2 = connecting.
     * - 3 = disconnecting.
     * @returns number
     */
    public abstract getReadyState(): number;
}
