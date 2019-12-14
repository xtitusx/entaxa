import * as express from 'express';

/** MimeType
 * @readonly
 * @enum {string}
 */
export enum MimeType {
    PNG = 'image/png',
    JPG = 'image/jpeg',
    JSON = 'application/json',
    SVG = 'image/svg+xml',
    PDF = 'application/pdf',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ODT = 'application/vnd.oasis.opendocument.text',
    TXT = 'text/plain',
    CSV = 'text/csv',
    ZIP = 'application/zip',
}

/**
 * @class MimeUtils
 */
export class MimeUtils {
    private static readonly CONTENT_TYPE: string = 'content-type';

    /**
     * Méthode qui retourne 'true' si le header de la réponse contient l'en-tête 'content-type' avec le type MIME passé en paramètre.
     * @param {express.Response} res
     * @param {MimeType} mimeType
     * @returns {boolean}
     */
    public static checkResponseContentType(res: express.Response, mimeType: MimeType): boolean {
        return (
            res.getHeaderNames().filter(
                (headerName) =>
                    headerName.toLowerCase() === MimeUtils.CONTENT_TYPE &&
                    res
                        .getHeader(headerName)
                        .toString()
                        .toLowerCase()
                        .indexOf(mimeType) !== -1
            ).length > 0
        );
    }
}
