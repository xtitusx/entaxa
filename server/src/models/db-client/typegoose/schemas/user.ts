import { Typegoose, prop } from '@hasezoey/typegoose';

export class User extends Typegoose {
    @prop({ required: true })
    username: string;

    @prop({ required: true })
    password: string;
}
