import { ErrorWrapper } from '@errors/error-wrapper';
import { DtoToViewMapperError } from '@errors/dto-view-mapper-error';
import { ViewToDtoMapperError } from '@errors/view-dto-mapper-error';

/**
 * @class DtoViewMapper<T, U>
 * - T : Dto
 * - U : View
 */
export abstract class DtoViewMapper<T, U> {
    constructor() {
        // Nullary constructor
    }

    /**
     * Méthode exposée du mappage d'un dto vers une vue.
     * @param dto T
     * @param id string (optionnel)
     * @return U - La vue
     */
    public dtoToView(dto: T, id?: string): U {
        try {
            return this.processDtoToViewMapping(dto, id);
        } catch (err) {
            throw err instanceof ErrorWrapper ? err : new ErrorWrapper(new DtoToViewMapperError(this), err);
        }
    }

    /**
     * Méthode exposée du mappage d'une vue vers un dto.
     * @param view U
     * @param id string (optionnel)
     * @return T - Le Dto
     */
    public viewToDto(view: U, id?: string): T {
        try {
            return this.processViewToDtoMapping(view, id);
        } catch (err) {
            throw err instanceof ErrorWrapper ? err : new ErrorWrapper(new ViewToDtoMapperError(this), err);
        }
    }

    /**
     * Méthode contenant le mappage des propriétés d'un dto vers une vue.
     * @param dto T
     * @param id string (optionnel)
     * @return U - La vue.
     */
    protected abstract processDtoToViewMapping(dto: T, id?: string): U;

    /**
     * Méthode contenant le mappage des propriétés d'une vue vers un dto.
     * @param view U
     * @param id string (optionnel)
     * @return Y - Le Dto.
     */
    protected abstract processViewToDtoMapping(view: U, id?: string): T;
}
