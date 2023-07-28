import { Controller, Post, Body, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthUserDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterUserDto, @Ip() ip: string) {
    return this.authService.register({ dto, ip });
  }
}
