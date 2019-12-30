import { ErrorResponse } from './error-response';
import { HttpStatusCode } from '@utils/http-status-code';

/**
 * @class StaticErrorResponse
 * @description Enumération des erreurs prédéfinies.
 */
export class StaticErrorResponse {
    // Erreur non référencée
    static UNKNOWN_ERROR = new ErrorResponse('unknown', 'Erreur non référencée', HttpStatusCode.UnknownError);

    // Erreur générique côté serveur
    static SERVICE_UNAVAILABE = new ErrorResponse(
        'service.unavailable',
        'Service non disponible',
        HttpStatusCode.ServiceUnavailable
    );

    /**
     * Erreurs CONFIG
     */

    /**
     * Erreurs MIDDLEWARE
     */

    /**
     * Erreurs MODEL
     */

    // Erreurs MODEL_DAO
    static MODEL_DAO_SEARCH = new ErrorResponse(
        'model.dao.search',
        'Erreur de recherche Modèle Dao',
        HttpStatusCode.InternalServerError
    );
    static MODEL_DAO_CREATION = new ErrorResponse(
        'model.dao.creation',
        'Erreur de création Modèle Dao',
        HttpStatusCode.InternalServerError
    );
    static MODEL_DAO_READ = new ErrorResponse(
        'model.dao.read',
        'Erreur de lecture Modèle Dao',
        HttpStatusCode.InternalServerError
    );
    static MODEL_DAO_UPDATE = new ErrorResponse(
        'model.dao.update',
        'Erreur de mise à jour Modèle Dao',
        HttpStatusCode.InternalServerError
    );
    static MODEL_DAO_DELETION = new ErrorResponse(
        'model.dao.deletion',
        'Erreur de suppression Modèle Dao',
        HttpStatusCode.InternalServerError
    );
    static MODEL_DAO_VALIDATION = new ErrorResponse(
        'model.dao.validation',
        'Erreur de validation Modèle Dao',
        HttpStatusCode.InternalServerError
    );

    /**
     * Erreurs SERVICE
     */

    // Erreurs SERVICE_DBCLIENT
    static SERVICE_DBCLIENT_CONNECTION = new ErrorResponse(
        'service.dbClient',
        'Erreur de connexion DbClient',
        HttpStatusCode.ServiceUnavailable
    );

    // Erreurs SERVICE_MODEL
    static SERVICE_MODEL = new ErrorResponse(
        'service.model',
        "Erreur d'accès à la couche Modèle",
        HttpStatusCode.InternalServerError
    );

    // Erreurs SERVICE_USER
    static SERVICE_USER_SEARCH = new ErrorResponse(
        'service.user.search',
        'Erreur de recherche Service User',
        HttpStatusCode.NotFound
    );
    static SERVICE_USER_CREATION = new ErrorResponse(
        'service.user.creation',
        'Erreur de création Service User',
        HttpStatusCode.InternalServerError
    );
    static SERVICE_USER_UPDATE = new ErrorResponse(
        'service.user.update',
        'Erreur de mise à jour Service User',
        HttpStatusCode.NotFound
    );
    static SERVICE_USER_DELETION = new ErrorResponse(
        'service.user.deletion',
        'Erreur de suppression Service User',
        HttpStatusCode.NotFound
    );
    static SERVICE_USER_VALIDATION = new ErrorResponse(
        'service.user.validation',
        'Erreur de validation Service User',
        HttpStatusCode.UnprocessableEntity
    );

    // Erreurs MAPPER
    static MAPPER_ELEMENT_MINIMIZER = new ErrorResponse(
        'mapper.element.minimizer',
        'Erreur du minimizer des données view',
        HttpStatusCode.InternalServerError
    );
}
