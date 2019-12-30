/**
 * @description Méthodes exposées par les DAOs (SCRUD).
 * @interface IDaoAdapter<T>
 */
export interface IDaoAdapter<T> {
    /**
     * Méthode qui renvoie le nom du modèle/collection.
     * @return string
     */
    getModelName(): string;

    /**
     * Méthode de création d'un document.
     * @param object T
     * @return Promise<T>
     */
    create(object: T): Promise<T>;

    /**
     * Méthode de mise à jour d'un document.
     * @param objectId string : L'ObjectId du document mis à jour.
     * @param object T
     * @return Promise<T>
     */
    update(objectId: string, object: T): Promise<T>;

    /**
     * Méthode d'enregistrement (création ou mise à jour) d'un document.
     * @param object T
     * @return Promise<T>
     */
    save(object: T): Promise<T>;

    /**
     * Méthode de recherche d'un document en fonction d'un ObjectId.
     * @param objectId string : L'ObjectId du document recherché.
     * @param projection object (optionnel)
     * @return Promise<T>
     */
    findById(objectId: string, projection?: object): Promise<T>;

    /**
     * Méthode de recherche de tous les documents.
     * @param projection object (optionnel)
     * @return Promise<Array<T>>
     */
    findAll(projection?: object): Promise<Array<T>>;

    /**
     * Méthode de recherche de documents en fonction d'une liste d'ObjectIds.
     * @param objectIds Array<string> : Liste d'ObjectIds.
     * @param projection object (optionnel)
     * @return Promise<Array<T>>
     */
    findByIds(objectIds: Array<string>, projection?: object): Promise<Array<T>>;

    /**
     * Méthode de recherche de documents en fonction de filtres.
     * @param filters any : Les filtres.
     * @param projection object (optionnel)
     * @return Promise<Array<T>>
     */
    findAllWithFilters(filters: any, projection?: object): Promise<Array<T>>;

    /**
     * Méthode de suppression d'un document en fonction d'un ObjectId.
     * @param objectId string : L'ObjectId du document supprimé.
     * @return Promise<T>
     */
    deleteById(objectId: string): Promise<T>;

    /**
     * Méthode de validation d'un document.
     * @param object T
     * @return Promise<void>
     */
    validate(object: T): Promise<void>;
}
