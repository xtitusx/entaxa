import { prop } from '@typegoose/typegoose';

export class User {
    @prop({ required: true })
    username: string;

    @prop({ required: true })
    password: string;
}
