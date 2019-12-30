import { DaoManager } from './dao-manager';
import { DbClient } from '@models/db-client/db-client';

export abstract class Dao<T extends DbClient<any>> {
    private readonly daoManager: DaoManager<T>;

    public constructor(daoManager: DaoManager<T>) {
        this.daoManager = daoManager;
    }

    /**
     * Méthode qui remonte l'instance de DaoManager auquel appartient l'object courant.
     */
    public getDaoManager() {
        return this.daoManager;
    }

    /**
     * Méthode qui renvoie le nom de la classe d'un objet.
     * @param object T
     * @return string
     */
    protected getClassName<T>(object: T): string {
        return object.constructor.name;
    }
}
