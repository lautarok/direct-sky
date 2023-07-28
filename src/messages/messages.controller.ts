import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiHeader, ApiHeaders, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiHeader({
  name: 'Authorization'
})
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    return this.messagesService.create(createMessageDto, req.user);
  }
}
