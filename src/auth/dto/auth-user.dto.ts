import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Length
} from 'class-validator';

export class AuthUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 20)
  password: string;
}