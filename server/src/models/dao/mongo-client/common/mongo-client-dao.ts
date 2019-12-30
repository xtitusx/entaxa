import mongodb = require('mongodb');

import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';
import { MongoClient } from '@models/db-client/mongo-client/mongo-client';
import { Dao } from '@dao/common/dao';
import { DaoManager } from '@dao/common/dao-manager';
import { LogLevel } from '@utils/logger';

export abstract class MongoClientDao<T> extends Dao<MongoClient> {
    private collectionName: string;
    private modelName: string;

    public constructor(daoManager: DaoManager<MongoClient>, collectionName: string, modelName: string) {
        super(daoManager);
        this.collectionName = collectionName;
        this.modelName = modelName;
    }

    /**
     * Méthode qui renvoie le nom de la collection.
     */
    public getCollectionName() {
        return this.collectionName;
    }

    /**
     * Méthode qui renvoie le nom du "modèle".
     */
    public getModelName() {
        return this.modelName;
    }

    /**
     * Méthode qui renvoie la collection.
     */
    private getCollection() {
        return (<mongodb.MongoClient>this.getDaoManager()
            .getDbClient()
            .getConnection())
            .db()
            .collection(this.getCollectionName());
    }

    /**
     * Méthode de création d'un document.
     * @param dto T
     * @return Promise<T>
     * @throws {ErrorResponse.MODEL_DAO_CREATION}
     */
    protected createOneDocument<T>(dto: T): Promise<T> {
        return this.getCollection()
            .insertOne(dto)
            .then((insertOneWriteOpResult: mongodb.InsertOneWriteOpResult<any>) => {
                this.getDaoManager()
                    .getLogger()
                    .log(
                        LogLevel.DEBUG,
                        `${this.getModelName()} créé [ObjectId = ${insertOneWriteOpResult.insertedId.toHexString()}]`
                    );
                return <T>insertOneWriteOpResult.ops[0];
            })
            .catch((err: Error) => {
                throw new ErrorWrapper(StaticErrorResponse.MODEL_DAO_CREATION, err);
            });
    }

    /**
     * Méthode de mise à jour complète / partielle d'un document en fonction de son ObjectId.
     * @param objectId string
     * @param dto T
     * @return Promise<T> : Document mis jour.
     * @throws {ErrorResponse.MODEL_DAO_UPDATE}
     */
    protected updateOneDocumentById<T>(objectId: string, dto: T): Promise<T> {
        return this.getCollection()
            .findOneAndUpdate({ _id: new mongodb.ObjectId(objectId) }, { $set: dto }, { returnOriginal: false })
            .then((findAndModifyWriteOpResultObject: mongodb.FindAndModifyWriteOpResultObject) => {
                if (findAndModifyWriteOpResultObject.ok === 1) {
                    this.getDaoManager()
                        .getLogger()
                        .log(
                            LogLevel.DEBUG,
                            `${this.getModelName()} mis à jour [ObjectId = ${
                                findAndModifyWriteOpResultObject.value._id
                            }]`
                        );
                } else {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                }
                return <T>findAndModifyWriteOpResultObject.value;
            })
            .catch((err: Error) => {
                throw new ErrorWrapper(StaticErrorResponse.MODEL_DAO_UPDATE, err);
            });
    }

    /**
     * Méthode d'enregistrement (création ou mise à jour complète / partielle) d'un document.
     * @param object T | { _id: mongodb.ObjectID } & T
     * @return Promise<(T>
     */
    protected upsertOneDocumentById<T>(object: T | { _id: mongodb.ObjectID } & T): Promise<T> {
        if (!(<{ _id: mongodb.ObjectID }>object)._id) {
            return this.createOneDocument(object);
        }
        return this.updateOneDocumentById((<{ _id: mongodb.ObjectID }>object)._id.toHexString(), object);
    }

    /**
     * Méthode de recherche d'un document en fonction de son ObjectId.
     * @param objectId string
     * @return Promise<{ _id: mongodb.ObjectID } & T>
     * @throws {ErrorResponse.MODEL_DAO_READ}
     */
    protected findOneDocumentById<T>(objectId: string): Promise<{ _id: mongodb.ObjectID } & T> {
        return this.getCollection()
            .findOne({ _id: new mongodb.ObjectId(objectId) })
            .then((document: { _id: mongodb.ObjectID } & T) => {
                if (document) {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} récupéré [ObjectId = ${document._id}]`);
                } else {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                }
                return document;
            })
            .catch((err: Error) => {
                throw new ErrorWrapper(StaticErrorResponse.MODEL_DAO_READ, err);
            });
    }

    /**
     * Méthode de recherche de tous les documents.
     * @param objectIds Array<string> (optionnel) : Recherche des documents en fonction d'une liste d'ObjectIds.
     * @return Promise<Array<T>>
     * @throws {ErrorResponse.MODEL_DAO_SEARCH}
     */
    public findAllDocuments<T>(objectIds?: Array<string>): Promise<Array<T>> {
        return this.getCollection()
            .find(objectIds ? this.buildInOperator(objectIds) : undefined)
            .toArray()
            .then((documents: Array<T>) => {
                this.getDaoManager()
                    .getLogger()
                    .log(LogLevel.DEBUG, `${this.getModelName()} récupérés [count = ${documents.length}]`);
                return documents;
            })
            .catch((err: Error) => {
                throw new ErrorWrapper(StaticErrorResponse.MODEL_DAO_SEARCH, err);
            });
    }

    /**
     * Méthode de suppression d'un document en fonction de son ObjectId.
     * @param objectId string
     * @return Promise<T>
     * @throws {ErrorResponse.MODEL_DAO_DELETION}
     */
    protected deleteOneDocumentById(objectId: string): Promise<T> {
        return this.getCollection()
            .findOneAndDelete({ _id: new mongodb.ObjectId(objectId) })
            .then((document: T) => {
                if (document) {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} supprimé [ObjectId = ${objectId}]`);
                } else {
                    this.getDaoManager()
                        .getLogger()
                        .log(LogLevel.DEBUG, `${this.getModelName()} non trouvé [ObjectId = ${objectId}]`);
                }
                return document;
            })
            .catch((err: Error) => {
                throw new ErrorWrapper(StaticErrorResponse.MODEL_DAO_DELETION, err);
            });
    }

    /**
     * Méthode de construction d'un opérateur "$in" contenant une liste d'ids.
     * @param objectIds Array<string>
     * @return Object
     */
    private buildInOperator(objectIds: Array<string>): Object {
        let array: mongodb.ObjectId[] = [];

        for (let objectId of objectIds) {
            array.push(mongodb.ObjectId.createFromHexString(objectId));
        }

        return {
            _id: { $in: array },
        };
    }
}
