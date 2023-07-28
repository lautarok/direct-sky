import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiHeaders, ApiNotFoundResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiHeader({
  name: 'Authorization'
})
@ApiBearerAuth('token')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'When message is created',
    schema: {
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
    description: 'When target user does not exist',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['target user does not exist']
        }
      }
    }
  })
  @ApiUnprocessableEntityResponse({
    description: 'When the submitting user matches the target',
    schema: {
      properties: {
        message: {
          type: 'array',
          default: ['you can\'t message yourself']
        }
      }
    }
  })
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    return this.messagesService.create(createMessageDto, req.user);
  }
}
