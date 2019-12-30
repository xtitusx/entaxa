export interface IUserView {
    username: string;
    password: string;
}

export class UserView implements IUserView {
    username: string;
    password: string;

    constructor() {
        this.username = null;
        this.password = null;
    }
}
