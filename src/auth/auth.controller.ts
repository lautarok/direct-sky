import { Controller, Post, Body, Ip, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'When the user logs in successfully',
    schema: {
      properties: {
        nickname: { type: 'string' },
        email: { type: 'string' },
        token: { type: 'string' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'When user is not found',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['user not found']
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Password is invalid',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['invalid password']
        }
      }
    }
  })
  login(@Body() dto: AuthUserDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'When the user is created successfully',
    schema: {
      properties: {
        nickname: { type: 'string' },
        email: { type: 'string' },
        token: { type: 'string' }
      }
    }
  })
  @ApiUnprocessableEntityResponse({
    description: 'Email or nickname is in use',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['this email is in use', 'this nickname is in use']
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: 'When you reach the maximum number of accounts that can be created from a given IP',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['we\'ve reached the maximum number of accounts that can be created from your IP address.']
        }
      }
    }
  })
  register(@Body() dto: RegisterUserDto, @Ip() ip: string) {
    return this.authService.register({ dto, ip });
  }
}
