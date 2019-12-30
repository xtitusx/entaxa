import { MongoClientDaoManager } from './common/mongo-client-dao-manager';
import { MongoClientDao } from './common/mongo-client-dao';
import { IDaoAdapter } from '@models/dao/common/i-dao-adapter';
import { IUser } from '@dto/user';

/**
 * @deprecated
 */
export class UserDao extends MongoClientDao<IUser> implements IDaoAdapter<IUser> {
    constructor(daoManager: MongoClientDaoManager, collectionName: string, modelName: string) {
        super(daoManager, collectionName, modelName);
    }

    /**
     * @override
     */
    public create(object: IUser): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public update(objectId: string, update: IUser): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public save(object: IUser): Promise<IUser> {
        return this.upsertOneDocumentById(object);
    }

    /**
     * @override
     */
    public findById(objectId: string, projection?: object): Promise<IUser> {
        return this.findOneDocumentById(objectId);
    }

    /**
     * @override
     */
    findAll(projection?: object): Promise<IUser[]> {
        return this.findAllDocuments();
    }

    /**
     * @override
     */
    findByIds(objectIds: string[], projection?: object): Promise<IUser[]> {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public findAllWithFilters(filters: any, projection?: object): Promise<IUser[]> {
        throw new Error('Method not implemented.');
    }

    /**
     * @override
     */
    public deleteById(objectId: string): Promise<IUser> {
        return this.deleteOneDocumentById(objectId);
    }

    /**
     * @override
     */
    public validate(object: IUser): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
