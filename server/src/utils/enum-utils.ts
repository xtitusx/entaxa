/**
 *@class EnumUtils
 */

export class EnumUtils {
    /**
     * Méthode qui vérifie si une énumération contient une certaine valeur.
     * @param enumeration any
     * @param searchElement string | number
     * @return void
     * @throws {RangeError}
     */
    public static validate(enumeration: any, searchElement: string | number): void {
        try {
            if (!Object.values(enumeration).includes(searchElement)) {
                throw new Error();
            }
        } catch {
            throw new RangeError(
                `La valeur '${searchElement}' de l'énumération est incorrecte , valeurs autorisées : ${Object.values(
                    enumeration
                )}`
            );
        }
    }
}
