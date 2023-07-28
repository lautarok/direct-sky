import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';

@ApiTags('Rooms')
@ApiBearerAuth('token')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Success operation',
    schema: {
      type: 'array',
      properties: {
        id: {
          type: 'string',
          description: 'Room unique UUID'
        },
        withUser: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            nickname: { type: 'string' }
          }
        },
        lastMessage: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            date: {
              type: 'string',
              description: 'Date as a string value in ISO format'
            },
            from: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                nickname: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Target user not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          default: ['user not found']
        }
      }
    }
  })
  findAll(@Request() req: any) {
    return this.roomsService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Success operation',
    schema: {
      type: 'array',
      items: {
        properties: {
          message: { type: 'string' },
          date: {
            type: 'string',
            description: 'Date as a string value in ISO format'
          },
          from: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              nickname: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'When room not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          default: ['room not found']
        }
      }
    }
  })
  findMessages(
    @Request() req: any,
    @Param('id') id: UUID
  ) {
    return this.roomsService.findMessages(id, req.user);
  }
}
