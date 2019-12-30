import { ModelService } from './common/model-service';
import { IDaoAdapter } from '@models/dao/common/i-dao-adapter';
import { IUser } from '@models/dto/user';
import { DbClient } from '@models/db-client/db-client';
import { ErrorWrapper } from '@errors/error-wrapper';
import { StaticErrorResponse } from '@errors/static-error-response';

export class UserService extends ModelService {
    private userDao: IDaoAdapter<IUser>;

    constructor(dbClient: DbClient<any>) {
        super(dbClient);
        this.init();
    }

    protected init() {
        super.init();
        this.userDao = this.getDaoManager().getUserDao();
    }

    /**
     * Méthode qui crée un user.
     * @param dto IUser
     * @return Promise<IUser>
     * @throws {ErrorResponse.SERVICE_USER_CREATION}
     */
    public async createUser(dto: IUser): Promise<IUser> {
        this.sanitize(dto);

        await this.validateUser(dto);
        const user = await this.userDao.create(dto);

        if (!(user && user._id)) {
            throw new ErrorWrapper(
                StaticErrorResponse.SERVICE_USER_CREATION,
                `${this.userDao.getModelName()} non créé`
            );
        }

        return user;
    }

    /**
     * Méthode qui modifie un user
     * @param id string
     * @param currentDto ILock : L'objet contenant les chemins qui doivent être modifiés.
     * @return Promise<IElement<any>>
     * @throws {ErrorResponse.SERVICE_USER_UPDATE}
     */
    public async updateUser(id: string, dto: IUser): Promise<IUser> {
        const user = await this.userDao.update(id, dto);

        if (!user) {
            throw new ErrorWrapper(
                StaticErrorResponse.SERVICE_USER_UPDATE,
                `${this.userDao.getModelName()} non trouvé [id = ${id}]`
            );
        }

        return user;
    }

    /**
     * Méthode qui renvoie un user.
     * @param id string
     * @param projection object (optionnel)
     * @return Promise<IUser>
     * @throws {ErrorResponse.SERVICE_USER_SEARCH}
     */
    public async getUser(id: string, projection?: object): Promise<IUser> {
        const user = await this.userDao.findById(id, projection);

        if (!user) {
            throw new ErrorWrapper(
                StaticErrorResponse.SERVICE_USER_SEARCH,
                `${this.userDao.getModelName()} non trouvé [id = ${id}]`
            );
        }

        return user;
    }

    /**
     * Méthode qui renvoie la liste des users.
     * @param projection object (optionnel)
     * @return Promise<Array<IUser>>
     */
    protected getUsers(projection?: object): Promise<Array<IUser>> {
        return this.userDao.findAll(projection);
    }

    /**
     * Méthode qui renvoie la liste des users ; en fonction d'ids.
     * @param ids Array<string>
     * @param projection object (optionnel)
     * @return Promise<Array<IUser>
     */
    protected getUsersByIds(ids: Array<string>, projection?: object): Promise<Array<IUser>> {
        return this.userDao.findByIds(ids, projection);
    }

    /**
     * Méthode qui renvoie la liste des users ; en fonction de filtres.
     * @param filters any
     * @param projection object (optionnel)
     * @return Promise<Array<IUser>
     */
    protected getUsersWithFilters(filters: any, projection?: object): Promise<Array<IUser>> {
        return this.userDao.findAllWithFilters(filters, projection);
    }

    /**
     * Méthode qui supprime un user.
     * @param id string
     * @return Promise<IUser>
     * @throws {ErrorResponse.SERVICE_USER_DELETION}
     */
    public async deleteElement(id: string): Promise<IUser> {
        const user = await this.userDao.deleteById(id);

        if (!user) {
            throw new ErrorWrapper(
                StaticErrorResponse.SERVICE_USER_DELETION,
                `${this.userDao.getModelName()} non trouvé [id = ${id}]`
            );
        }

        return user;
    }

    /**
     * Méthode qui valide un user.
     *
     * Validation dite "bas-niveau" contenue dans la couche Modèle.
     * @param dto IUser
     * @return Promise<void>
     */
    protected async validateUser(dto: IUser): Promise<void> {
        await this.userDao.validate(dto);
    }

    /**
     * Méthode qui nettoie le Dto :
     * - Suppression de la propriété '_id'.
     * @param currentDto any
     * @return void
     */
    private sanitize(currentDto: any) {
        delete currentDto._id;
    }
}
