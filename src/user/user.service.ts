import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      const findEMail = await this.findOneByEmail(user.email);
      if (findEMail) {
        throw new ConflictException('email already registered');
      }

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(createUserDto.password, salt);

      user.role = createUserDto.role;
      const savedUser = await this.userRepository.save(user);
      return {
        message: 'User created successfully',
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user: ' + error.message,
      );
    }
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, UpdateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      await this.userRepository.update(id, UpdateUserDto);
      return { ...existingUser, ...UpdateUserDto };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        // Duplicate entry
        throw new ConflictException('Email or username already exists');
      }
      throw new InternalServerErrorException(
        'Failed to update User',
        error.message,
      );
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Id must be provided');
    }
    const find = await this.userRepository.findOne({ where: { id } });
    if (!find) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      await this.userRepository.delete(id);
      return { message: 'user deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user',
        error.message,
      );
    }
  }
}
