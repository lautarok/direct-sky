import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash, compare } from 'bcrypt';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';

const generateJwtToken = (
  data: Record<string, unknown>,
  jwtService: JwtService
) => jwtService.sign({...data})

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(dto: AuthUserDto) {
    const matchUser = await this.usersRepository.findOneBy({
      email: dto.email
    });

    if(!matchUser) {
      throw new NotFoundException({
        message: ['user not found']
      });
    }

    const passwordCompare = await compare(dto.password, matchUser.password);

    if(!passwordCompare) {
      throw new UnauthorizedException({
        message: ['invalid password']
      });
    }

    const token = generateJwtToken({
      nickname: matchUser.nickname,
      email: matchUser.email,
      id: matchUser.id
    }, this.jwtService);

    return {
      nickname: matchUser.nickname,
      email: matchUser.email,
      token
    };
  }
  
  async register({ dto, ip } : {
    dto: RegisterUserDto,
    ip: string
  }) {
    const matchUser = await this.usersRepository.findOne({
      where: [
        {nickname: dto.nickname},
        {email: dto.email}
      ]
    });

    if(matchUser) {
      throw new UnprocessableEntityException({
        message: [`this ${matchUser.nickname === dto.nickname ? 'nickname' : 'email'} is in use`]
      });
    }

    const userCountByIp = await this.usersRepository.countBy({
      ip
    })

    if(userCountByIp > 2) {
      throw new ForbiddenException({
        message: ['we\'ve reached the maximum number of accounts that can be created from your IP address.']
      })
    }
    
    const passwordHash = await hash(dto.password, 10);

    const inserted = await this.usersRepository.insert({
      nickname: dto.nickname,
      email: dto.email,
      password: passwordHash,
      ip
    });

    const token = generateJwtToken({
      nickname: dto.nickname,
      email: dto.email,
      id: inserted.identifiers[0].id
    }, this.jwtService);

    return {
      nickname: dto.nickname,
      email: dto.email,
      token
    };
  }
}
