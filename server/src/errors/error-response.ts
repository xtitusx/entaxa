export class ErrorResponse {
    private key: string;
    private description: string;
    private status: number;
    private success: boolean;

    // Erreur non référencée
    static UNKNOWN_ERROR = new ErrorResponse('unknown', 'Erreur non référencée', 520);

    // Erreur générique côté serveur
    static SERVICE_UNAVAILABE = new ErrorResponse('service.unavailable', 'Service non disponible', 503);

    // Erreurs DAO
    static DAOMANAGER_INIT = new ErrorResponse('daoManager.initialization', "Erreur d'initialisation DaoManager", 500);
    static DAO_CREATION = new ErrorResponse('dao.creation', 'Erreur de création Dao', 500);
    static DAO_READ = new ErrorResponse('dao.read', 'Erreur de lecture Dao', 500);
    static DAO_UPDATE = new ErrorResponse('dao.update', 'Erreur de mise à jour Dao', 500);
    static DAO_DELETE = new ErrorResponse('dao.delete', 'Erreur de suppression Dao', 500);
    static DAO_VALIDATION = new ErrorResponse('dao.validation', 'Erreur de validation Dao', 500);

    // Erreurs Object Métier
    static USER_NOT_FOUND = new ErrorResponse('user.notFound', 'User incorrect', 404);

    private constructor(key: string, description: string, status: number) {
        this.key = key;
        this.description = description;
        this.status = status;
        this.success = false;
    }

    public getKey() {
        return this.key;
    }

    public getDescription() {
        return this.description;
    }

    public getStatus() {
        return this.status;
    }

    public isSuccess() {
        return this.success;
    }
}
