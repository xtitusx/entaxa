import mongoose = require('mongoose');
import { ObjectID } from 'mongodb';

import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';
import { Mongoose } from '@models/db-client/mongoose/mongoose';
import { Typegoose } from '@models/db-client/typegoose/typegoose';
import { Dao } from '@dao/common/dao';
import { DaoManager } from '@dao/common/dao-manager';
import { LogLevel } from '@utils/logger';

export abstract class MongooseDao<T> extends Dao<Mongoose | Typegoose> {
    private model: mongoose.Model<InstanceType<any>, {}>;

    public constructor(daoManager: DaoManager<Mongoose | Typegoose>, model: mongoose.Model<InstanceType<any>, {}>) {
        super(daoManager);
        this.model = model;
    }

    /**
     * Méthode qui renvoie l'instance du modèle liée au Dao.
     */
    public getModel() {
        return this.model;
    }

    /**
     * Méthode qui renvoie le nom du modèle.
     * @return string
     */
    public getModelName(): string {
        return this.getModel().modelName;
    }

    /**
     * Méthode de création d'un document.
     * @param dto T
     * @return Promise<mongoose.Document & T>
     * @throws {ErrorResponse.MODEL_DAO_CREATION}
     */
    protected createOneDocument<T>(dto: T): Promise<mongoose.Document & T> {
        return new Promise<mongoose.Document & T>((resolve: Function, reject: Function) => {
            this.getModel()
                .create(dto)
                .then((document: mongoose.Document & T) => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} créé [ObjectId = ${document.id}]`);
                    resolve(document);
                })
                .catch((err: Error) => {
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_CREATION, err));
                });
        });
    }

    /**
     * Méthode de mise à jour complète / partielle d'un document en fonction de son ObjectId.
     * @param objectId string | ObjectID
     * @param dto T
     * @return Promise<mongoose.Document & T> : Document mis jour.
     * @throws {ErrorResponse.MODEL_DAO_UPDATE}
     */
    protected updateOneDocumentById<T>(objectId: string | ObjectID, dto: T): Promise<mongoose.Document & T> {
        return new Promise<mongoose.Document & T>((resolve: Function, reject: Function) =>
            this.getModel()
                .findByIdAndUpdate(objectId, { $set: dto }, { new: true, runValidators: true })
                .then((document: mongoose.Document & T) => {
                    if (document) {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} mis à jour [ObjectId = ${document.id}]`);
                    } else {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                    }
                    resolve(document);
                })
                .catch((err: Error) => {
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_UPDATE, err));
                })
        );
    }

    /**
     * Méthode d'enregistrement (création ou mise à jour complète / partielle) d'un document.
     * @param object T | mongoose.Document & T : Dto ou Document.
     * @return Promise<mongoose.Document & T>
     */
    protected upsertOneDocumentById<T>(object: T | mongoose.Document & T): Promise<mongoose.Document & T> {
        if (!(<mongoose.Document>object)._id) {
            return this.createOneDocument(object);
        }
        return this.updateOneDocumentById((<mongoose.Document>object)._id, object);
    }

    /**
     * Méthode de recherche d'un document en fonction de son ObjectId.
     * @param objectId string
     * @param projection object (optionnel)
     * @return Promise<mongoose.Document & T>
     * @throws {ErrorResponse.MODEL_DAO_READ}
     */
    protected findOneDocumentById<T>(objectId: string, projection?: object): Promise<mongoose.Document & T> {
        return new Promise<mongoose.Document & T>((resolve: Function, reject: Function) =>
            this.getModel()
                .findById(objectId, projection ? projection : null)
                .then((document: mongoose.Document & T) => {
                    if (document) {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} récupéré [ObjectId = ${document.id}]`);
                    } else {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                    }
                    resolve(document);
                })
                .catch((err: Error) => {
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_READ, err));
                })
        );
    }

    /**
     * Méthode de recherche de tous les documents.
     * @param objectIds Array<string> (optionnel) : Recherche des documents en fonction d'une liste d'ObjectIds.
     * @param projection object (optionnel)
     * @return Promise<Array<mongoose.Document & T>>
     * @throws {ErrorResponse.MODEL_DAO_SEARCH}
     */
    public findAllDocuments<T>(objectIds?: Array<string>, projection?: object): Promise<Array<mongoose.Document & T>> {
        return new Promise<Array<mongoose.Document & T>>((resolve: Function, reject: Function) =>
            this.getModel()
                .find(objectIds ? this.buildInOperator(objectIds) : null, projection ? projection : null)
                .then((documents: Array<mongoose.Document & T>) => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} récupérés [count = ${documents.length}]`);
                    resolve(documents);
                })
                .catch((err: Error) => {
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_SEARCH, err));
                })
        );
    }

    /**
     * Méthode de recherche de documents en fonction de filtres.
     * @param filters any
     * @param projection object (optionnel)
     * @return Promise<mongoose.Document & T>
     * @throws {ErrorResponse.MODEL_DAO_SEARCH}
     */
    public findDocumentsWithFilters(filters: any, projection?: object): Promise<(mongoose.Document & T)[]> {
        return new Promise<Array<mongoose.Document & T>>((resolve: Function, reject: Function) =>
            this.getModel()
                .find(filters.getFindOptions(), projection ? projection : null)
                .sort(filters.getSortOrder())
                .skip(filters.getPageOptions().offset)
                .limit(filters.getPageOptions().limit)
                .exec()
                .then((documents: Array<mongoose.Document & T>) => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} récupérés [count = ${documents.length}]`);
                    resolve(documents);
                })
                .catch((err: Error) => {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.ERROR, `${err.message}`);
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_SEARCH, err));
                })
        );
    }

    /**
     * Méthode de suppression d'un document en fonction de son ObjectId.
     * @param objectId string
     * @return Promise<mongoose.Document & T>
     * @throws {ErrorResponse.MODEL_DAO_DELETION}
     */
    protected deleteOneDocumentById(objectId: string): Promise<mongoose.Document & T> {
        return new Promise<mongoose.Document & T>((resolve: Function, reject: Function) =>
            this.getModel()
                .findByIdAndRemove(objectId)
                .then((document: mongoose.Document & T) => {
                    if (document) {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} supprimé [ObjectId = ${document.id}]`);
                    } else {
                        this.getDaoManager()
                            .getLogger()
                            .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                    }
                    resolve(document);
                })
                .catch((err: Error) => {
                    reject(new ErrorWrapper(StaticErrorResponse.MODEL_DAO_DELETION, err));
                })
        );
    }

    /**
     * Méthode de construction d'un opérateur "$in" contenant une liste d'ids.
     * @param objectIds Array<string>
     * @return object
     */
    private buildInOperator(objectIds: Array<string>): object {
        let array: mongoose.Types.ObjectId[] = [];

        for (let objectId of objectIds) {
            array.push(mongoose.Types.ObjectId(objectId));
        }

        return {
            _id: { $in: array },
        };
    }
}
