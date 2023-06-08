import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async createUser(signUpDto: SignUpDto): Promise<void> {
    const { email, nickname, password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, nickname, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.update({ userId }, { refreshToken });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email } });
  }

  async findUserById(userId: number): Promise<User> {
    return await this.findOne({ where: { userId } });
  }

  async incrementUserBanCount(userId: number) {
    await this.increment({ userId }, 'banCount', 1);
  }
}
