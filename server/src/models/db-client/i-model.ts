/**
 * @interface
 */
export interface IModel {
    /**
     * Méthode qui crée les instances des modèles.
     * @returns void
     */
    createModels(): void;

    getUserModel();
}
