import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findOne(email: string) {
    const matchUser = await this.usersRepository.findOneBy({ email });

    if(!matchUser) {
      return new NotFoundException({
        message: ['user not found']
      });
    }

    return {
      email: matchUser.email,
      nickname: matchUser.nickname
    }
  }
}
