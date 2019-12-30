import { ErrorResponse } from './error-response';
import { HttpStatusCode } from '@utils/http-status-code';
import { StringUtils } from '@utils/string-utils';

/**
 * @class DtoToViewMapperError
 * @extends {ErrorResponse}
 */
export class DtoToViewMapperError extends ErrorResponse {
    public static readonly rootKey = 'mapper';

    public constructor(key: any) {
        super(key);
        this.key = `${DtoToViewMapperError.rootKey}.${this.build(key.constructor.name)}.dtoToView`;
        this.description = 'Erreur de mappage des données dto vers view';
        this.httpStatusCode = HttpStatusCode.InternalServerError;
    }

    private build(key: any) {
        return StringUtils.lowerCaseFirstLetter(
            (<string>key).replace(StringUtils.capitalize(DtoToViewMapperError.rootKey), '')
        );
    }
}
