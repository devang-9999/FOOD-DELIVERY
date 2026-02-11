import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUp } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from './dto/login.dto';
import { FirebaseLogin } from './dto/firebaseLogin.dto';
import { Authentication } from './entities/authentication.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Authentication)
    private readonly authenticationRepository: Repository<Authentication>,
  ) {}

  async signUp(createUserDto: SignUp) {
    const { email } = createUserDto;

    const user = await this.authenticationRepository.findOne({
      where: { email: email },
    });

    if (user) {
      throw new ConflictException('User already registered');
    }

    const signUpUser = this.authenticationRepository.create(createUserDto);
    return await this.authenticationRepository.save(signUpUser);
  }

  getAllusers() {
    return this.authenticationRepository.find();
  }

  async login(loginDto: Login) {
    const { email, password } = loginDto;
    const User = await this.authenticationRepository.findOne({
      where: {
        email: email,
        password: password,
        isBanned: false,
      },
    });

    if (!User) {
      throw new HttpException({ message: 'Invalid credentials' }, 401);
    }

    return User;
  }

  async googleLogin(loginDto: FirebaseLogin) {
    const { email } = loginDto;
    const User = await this.authenticationRepository.findOne({
      where: {
        email: email,
        isBanned: false,
      },
    });
    if (User) {
      return User;
    } else {
      const googleUser = this.authenticationRepository.create(loginDto);
      return await this.authenticationRepository.save(googleUser);
    }
  }

  async githubLogin(loginDto: FirebaseLogin) {
    const { email } = loginDto;
    const User = await this.authenticationRepository.findOne({
      where: {
        email: email,
        isBanned: false,
      },
    });
    if (User) {
      return User;
    } else {
      const githubUser = this.authenticationRepository.create(loginDto);
      return await this.authenticationRepository.save(githubUser);
    }
  }

  async getById(id: number) {
    const User = await this.authenticationRepository.findOneBy({ id: id });
    if (!User) {
      throw new NotFoundException('User not found');
    }
    return User;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const User = await this.authenticationRepository.preload({
      id: id,
      email: updateUserDto.email,
      password: updateUserDto.password,
    });
    if (!User) {
      throw new NotFoundException('User not found');
    }
    return this.authenticationRepository.save(User);
  }

  async removeById(id: number) {
    const User = await this.authenticationRepository.findOne({
      where: { id: id },
    });

    if (!User) {
      throw new NotFoundException('User not found');
    }
    return await this.authenticationRepository.remove(User);
  }

  async banUser(userId: number) {
    const user = await this.authenticationRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isBanned = true;
    return this.authenticationRepository.save(user);
  }

  async unbanUser(userId: number) {
    const user = await this.authenticationRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isBanned = false;
    return this.authenticationRepository.save(user);
  }
}
