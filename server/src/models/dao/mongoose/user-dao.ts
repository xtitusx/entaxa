import mongoose from 'mongoose';

import { MongooseDaoManager } from './common/mongoose-dao-manager';
import { MongooseDao } from './common/mongoose-dao';
import { MongooseFilter } from './common/mongoose-filter';
import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';
import { IUser } from '@models/dto/user';
import { IDaoAdapter } from '@dao/common/i-dao-adapter';
import { LogLevel } from '@utils/logger';

/**
 * @class UserDao
 * @extends {MongooseDao<IUser>}
 * @implements {IDaoAdapter<IUser>}
 */
export class UserDao extends MongooseDao<IUser> implements IDaoAdapter<IUser> {
    constructor(daoManager: MongooseDaoManager, model: mongoose.Model<InstanceType<any>, {}>) {
        super(daoManager, model);
    }

    /**
     * @override
     */
    public create(object: IUser): Promise<IUser> {
        return this.createOneDocument(object);
    }

    /**
     * @override
     */
    public update(objectId: string, object: IUser): Promise<mongoose.Document & IUser> {
        return this.updateOneDocumentById(objectId, object);
    }

    /**
     * @override
     */
    public save(object: IUser): Promise<mongoose.Document & IUser> {
        return this.upsertOneDocumentById(object);
    }

    /**
     * @override
     */
    public findById(objectId: string, projection: object): Promise<mongoose.Document & IUser> {
        return projection ? this.findOneDocumentById(objectId, projection) : this.findOneDocumentById(objectId);
    }

    /**
     * @override
     */
    public findAll(projection?: object): Promise<(mongoose.Document & IUser)[]> {
        return projection ? this.findAllDocuments(null, projection) : this.findAllDocuments();
    }

    /**
     * @override
     */
    public findByIds(objectIds: Array<string>, projection?: object): Promise<(mongoose.Document & IUser)[]> {
        return projection ? this.findAllDocuments(objectIds, projection) : this.findAllDocuments(objectIds);
    }

    /**
     * @override
     */
    public findAllWithFilters(filters: any, projection?: object): Promise<(mongoose.Document & IUser)[]> {
        let mongooseFilter: MongooseFilter<any>;

        return projection
            ? this.findDocumentsWithFilters(mongooseFilter, projection)
            : this.findDocumentsWithFilters(mongooseFilter);
    }

    /**
     * @override
     */
    public deleteById(objectId: string): Promise<mongoose.Document & IUser> {
        return this.deleteOneDocumentById(objectId);
    }

    /**
     * @override
     */
    public validate(object: IUser): Promise<void> {
        return new Promise<void>(async (resolve: Function, reject: Function) => {
            (<mongoose.Document & IUser>new (this.getModel() as mongoose.Model<any, {}>)(object))
                .validate()
                .then(() => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} validé`);
                    resolve();
                })
                .catch((err: Error) => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.ERROR, `${err.message}`);
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_VALIDATION, err));
                });
        });
    }
}
