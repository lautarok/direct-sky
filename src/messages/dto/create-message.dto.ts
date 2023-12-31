import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsUUID,
  Length
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsEmail()
  toEmail: string;

  @ApiProperty()
  @Length(1, 10000)
  message: string;

  @ApiProperty()
  @IsUUID()
  sessionUUID: string;
}