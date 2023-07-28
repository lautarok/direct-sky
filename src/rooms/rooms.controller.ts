import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.roomsService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findMessages(
    @Request() req: any,
    @Param('id') id: UUID
  ) {
    return this.roomsService.findMessages(id, req.user);
  }
}
