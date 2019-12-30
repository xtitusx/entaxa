import { MongoClient } from '@models/db-client/mongo-client/mongo-client';
import { DaoManager } from '@dao/common/dao-manager';
import { IDaoAdapter } from '@dao/common/i-dao-adapter';
import { UserDao } from '@dao/mongo-client/user-dao';
import { IUser } from '@dto/user';

/**
 * @class MongoClientDaoManager
 * @extends {DaoManager<MongoClient>}
 */
export class MongoClientDaoManager extends DaoManager<MongoClient> {
    constructor(dbClient: MongoClient) {
        super(dbClient);
    }

    /**
     * @override
     */
    public getUserDao(): IDaoAdapter<IUser> {
        if (this.userDao === undefined) {
            this.userDao = new UserDao(this, 'users', 'User');
        }
        return this.userDao;
    }
}
