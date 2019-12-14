/** DbClientType - La liste des drivers DB/ODM/ORM supportés.
 * @readonly
 * @enum {string}
 */
export enum DbClientType {
    MONGOCLIENT = 'MongoClient',
    MONGOOSE = 'Mongoose',
    TYPEGOOSE = 'Typegoose',
}
