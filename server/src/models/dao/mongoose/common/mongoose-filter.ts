// Imports Commons
//import { QueryParam } from '@_commons/models/query-params/query-param';

import { LoggerWrapper, LogLevel } from '@utils/logger';
import { StringUtils } from '@utils/string-utils';

export interface PageOptions {
    offset?: number;
    limit?: number;
}

/**
 * @class MongooseFilter
 */
export class MongooseFilter<T extends any> {
    protected static readonly BYPASS_PAGINATION = -1;

    protected logger: LoggerWrapper;
    protected query: T;
    private pageOptions: PageOptions;
    protected sortOrder: Array<string | Array<string>> = new Array();
    protected findOptions: object;

    constructor(logger: LoggerWrapper, query: T) {
        this.logger = logger;
        this.query = query;

        this.buildPageOptions();
        this.buildFindOptions();
    }

    /**
     * Méthode qui renvoie l'objet {`offset` / `limit`}, à utiliser dans une recherche Mongoose
     *
     * Par défaut, `offset` vaut 0 et `limit` vaut 25.
     * `limit` est compris entre 0 et 100.
     *
     * Query de la requête doit contenir les entrées `page` et `limit`.
     * @return PageOptions
     */
    public getPageOptions(): PageOptions {
        return this.pageOptions;
    }

    /**
     * Méthode qui renvoie l'ordre de tri, à utiliser dans une recherche Mongoose.
     * @return Array<string | Array<string>>
     */
    public getSortOrder(): Array<string | Array<string>> {
        return this.sortOrder;
    }

    /**
     * Méthode qui renvoie les filtres, à utiliser dans une recherche Mongoose.
     * @return object
     */
    public getFindOptions(): object {
        return this.findOptions;
    }

    private buildPageOptions(): void {
        let offsetValue = 0;
        let limitValue = 25;

        if (this.query.limit) {
            if (this.query.limit === MongooseFilter.BYPASS_PAGINATION) {
                limitValue = 500000;
            } else if (this.query.limit > 0 && this.query.limit <= 100) {
                limitValue = parseInt(<any>this.query.limit);
            }
        }
        if (this.query.page && this.query.page > 0) {
            offsetValue = limitValue * (this.query.page - 1);
        }

        this.logger.log(
            LogLevel.DEBUG,
            `Construction des options de pagination [{offset: ${offsetValue}, limit: ${limitValue}}]`
        );

        this.pageOptions = { offset: offsetValue, limit: limitValue };
    }

    /**
     * Méthode de conversion d'une chaîne de tri en objet 'sortOrder'.
     * @todo Tâche #3228
     * @param tri string : Un tri personnalisé (ex : lastname,ASC;firstname,ASC).
     * @param defaultSort Array<string | Array<string>> : Le tri ou les tris appliqués si aucun tri personnalisé n'est spécifié.
     * @param mapping Map<string, string| Array<string>> : Une Map dont la clé correspond à une propriété du tri, et la valeur correspond à une ou plusieurs propriétés du modèle.
     * @return void
     */
    protected buildSortOrder(
        tri: string,
        defaultSort: Array<string | Array<string>>,
        mapping: Map<string, string | Array<string>>
    ): void {
        if (!StringUtils.isString(tri, false) || StringUtils.isEmptyString(tri)) {
            this.sortOrder = defaultSort;
        } else {
            // Transformation en tableau d'informations à trier (séparateur ;)
            const triLst = tri.split(';');

            triLst.forEach((elt) => {
                // Décomposition en tableau [info à trier, asc|desc]
                const infoATrier = elt.split(',');

                if (mapping.has(infoATrier[0])) {
                    if (Array.isArray(mapping.get(infoATrier[0]))) {
                        const modelProperties: Array<string> = <any>mapping.get(infoATrier[0]);

                        for (let i = 0; i < modelProperties.length; i++) {
                            const modelProperty: string = modelProperties[i];
                            this.sortOrder.push([modelProperty, infoATrier[1]]);
                        }
                    } else {
                        const modelProperty: string = <any>mapping.get(infoATrier[0]);
                        this.sortOrder.push([modelProperty, infoATrier[1]]);
                    }
                }
            });
        }

        this.logger.log(LogLevel.DEBUG, `Conversion du tri en object 'sort' [tri = ${tri} / sort = ${this.sortOrder}]`);
    }

    protected buildFindOptions(): void {
        this.findOptions = {};
    }
}
