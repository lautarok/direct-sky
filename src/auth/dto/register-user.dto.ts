import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Length
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @Length(6, 20)
  nickname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 20)
  password: string;
}