/**
 *@class StringUtils
 */
export class StringUtils {
    /**
     * Méthode qui retourne 'true' si la valeur évaluée est de type 'string'.
     * @param str string
     * @param nullable boolean : Autorise une valeur 'null'.
     * @return boolean
     */
    public static isString(str: string, nullable: boolean): boolean {
        return nullable ? typeof str === 'string' || str === null : typeof str === 'string';
    }

    /**
     * Méthode qui vérifie qu'une chaîne de caractère est vide ("") et tolère les valeurs :
     * - 'null'.
     * - 'undefined'.
     * @param str string
     * @return boolean
     * @throws {RangeError} Si une valeur n'est pas de type 'string' ('null' et 'undefined' autorisés), une RangeError est levée.
     */
    public static isEmptyString(str: string): boolean {
        if (str === undefined) {
            return true;
        }
        if (!StringUtils.isString(str, true)) {
            throw new RangeError(`Le type (${typeof str}) de la valeur évaluée (${str}) n'est pas de type 'string'`);
        }

        return str ? str.trim().length === 0 : true;
    }

    /**
     * Méthode qui retourne une chaîne de caractères sans espaces.
     * @param str string
     * @return string
     */
    public static removeMultipleSpaces(str: string): string {
        return str.replace(/\s/g, '');
    }

    /**
     * Méthode qui retourne une chaîne de caractères sans espaces multiples.
     * @param str string
     * @param trimmed boolean : Retire les espaces en début et fin de chaîne .
     * @return string
     */
    public static replaceMultipleSpacesWithSingleSpace(str: string, trimmed: boolean): string {
        if (trimmed === true) {
            return str.replace(/\s\s+/g, ' ').trim();
        }

        return str.replace(/\s\s+/g, ' ');
    }

    /**
     * Méthode qui retourne une chaîne de caractères complétée à gauche.
     * @param str string
     * @param padChar string : Caractère de complétion.
     * @param size number
     * @return string
     */
    public static padLeft(str: string, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + str).substr(size * -1, size);
    }

    /**
     * Méthode qui retourne une chaîne de caractères complétée à droite.
     * @param str string
     * @param padChar string : Caractère de complétion.
     * @param size number
     * @return string
     */
    public static padRight(str: string, padChar: string, size: number): string {
        return (str + String(padChar).repeat(size)).substr(0, size);
    }

    /**
     * Méthode qui retourne une chaîne de caractères contenant les éléments de la liste.
     * @param array Array<any>
     * @param separator string (optionnel) : Séparateur entre chaque élément.
     * @return string
     */
    public static stringify(array: Array<any>, separator?: string): string {
        let str: string;

        for (let i = 0; i < array.length; i++) {
            if (i === 0) {
                str = '';
            }

            if (!StringUtils.isEmptyString(str) && separator) {
                str += separator;
            }
            str += array[i];
        }

        return str;
    }

    /**
     * Méthode qui écrit en majuscule la première lettre d'une chaîne de caractères.
     * @param str string
     * @return string
     */
    public static capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Méthode qui écrit en minuscule la première lettre d'une chaîne de caractères.
     * @param str string
     * @return string
     */
    public static lowerCaseFirstLetter(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
