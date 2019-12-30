import { ObjectID } from 'mongodb';

export interface IUser {
    _id: ObjectID;
    username: string;
    password: string;
}

export class User implements IUser {
    _id: ObjectID;
    username: string;
    password: string;

    constructor() {
        this._id = null;
        this.username = null;
        this.password = null;
    }
}
