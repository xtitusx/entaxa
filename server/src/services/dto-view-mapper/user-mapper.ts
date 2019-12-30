import { UserView } from '../../common/user-view';
import { IUser, User } from '@dto/user';
import { DtoViewMapper } from '@services/common/dto-view-mapper';

export class UserMapper extends DtoViewMapper<IUser, UserView> {
    /**
     * @override
     * @param userDto
     */
    protected processDtoToViewMapping(userDto: IUser) {
        let userView: UserView;

        if (userDto) {
            userView = new UserView();
            userView.username = userDto.username;
            userView.password = userDto.password;
        }

        return userView;
    }

    /**
     * @override
     * @param userView
     */
    protected processViewToDtoMapping(userView: UserView) {
        let userDto: User;

        if (userView) {
            userDto = new User();
            userDto.username = userView.username;
            userDto.password = userView.password;
        }

        return userDto;
    }
}
