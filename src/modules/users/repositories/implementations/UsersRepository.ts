import { getRepository, Repository } from 'typeorm';
import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.findOneOrFail(user_id, { relations: ['games'] });
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`
      SELECT *
      FROM USERS
      ORDER BY USERS.FIRST_NAME
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`
      SELECT * 
      FROM USERS
      WHERE LOWER(USERS.FIRST_NAME) = $1
      AND LOWER(USERS.LAST_NAME) = $2
    `, [first_name.toLowerCase(), last_name.toLowerCase()]);
  }
}
