import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  @ApiOkResponse({
    description: 'Success operation',
    schema: {
      properties: {
        email: { type: 'string' },
        nickname: { type: 'string' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['user not found']
        }
      }
    }
  })
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }
}