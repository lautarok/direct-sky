import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [TypeOrmModule.forFeature([Room, Message, User])]
})
export class RoomsModule {}
