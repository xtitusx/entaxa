import { ErrorResponse } from './error-response';
import { HttpStatusCode } from '@utils/http-status-code';
import { StringUtils } from '@utils/string-utils';

/**
 * @class ViewToDtoMapperError
 * @extends {ErrorResponse}
 */
export class ViewToDtoMapperError extends ErrorResponse {
    public static readonly rootKey = 'mapper';

    public constructor(key: any) {
        super(key);
        this.key = `${ViewToDtoMapperError.rootKey}.${this.build(key.constructor.name)}.viewToDto`;
        this.description = 'Erreur de mappage des données view vers dto';
        this.status = HttpStatusCode.InternalServerError;
    }

    private build(key: any) {
        return StringUtils.lowerCaseFirstLetter(
            (<string>key).replace(StringUtils.capitalize(ViewToDtoMapperError.rootKey), '')
        );
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
