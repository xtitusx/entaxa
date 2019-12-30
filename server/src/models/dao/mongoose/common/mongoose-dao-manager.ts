import { Mongoose } from '@models/db-client/mongoose/mongoose';
import { Typegoose } from '@models/db-client/typegoose/typegoose';
import { DaoManager } from '@dao/common/dao-manager';
import { UserDao } from '@dao/mongoose/user-dao';

/**
 * @class MongooseDaoManager
 * @extends {DaoManager<Mongoose | Typegoose>}
 */
export class MongooseDaoManager extends DaoManager<Mongoose | Typegoose> {
    constructor(dbClient: Mongoose | Typegoose) {
        super(dbClient);
    }

    /**
     * @override
     */
    public getUserDao() {
        if (this.userDao === undefined) {
            this.userDao = new UserDao(this, this.getDbClient().getUserModel());
        }
        return this.userDao;
    }
}
