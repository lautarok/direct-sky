import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { randomUUID } from 'crypto';
import { clients } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>
  ) {}

  async create(dto: CreateMessageDto, user: {
    id: number,
    email: string,
    nickname: string
  }) {
    const toUser = await this.usersRepository.findOneBy({
      email: dto.toEmail
    });

    if(!toUser) {
      throw new NotFoundException();
    } else if(toUser.id === user.id) {
      throw new UnprocessableEntityException({
        message: ['You can\'t message yourself']
      });
    }

    const room = await this.roomsRepository.findOne({
      where: [
        {
          user1: user.id,
          user2: toUser.id
        },
        {
          user1: toUser.id,
          user2: user.id
        }
      ]
    });

    let roomId: string

    if(!room) {
      const uuid = randomUUID()
      
      await this.roomsRepository.insert({
        roomId: uuid,
        user1: user.id,
        user2: toUser.id
      })

      roomId = uuid
    } else {
      roomId = room.roomId
    }

    await this.messagesRepository.insert({
      fromUser: user.id,
      room: roomId,
      message: dto.message
    });

    const result = {
      id: roomId,
      withUser: {
        email: toUser.email,
        nickname: toUser.nickname
      },
      lastMessage: {
        message: dto.message,
        date: new Date().toISOString(),
        from: {
          email: user.email,
          nickname: user.nickname
        }
      }
    }

    clients.forEach(client => {
      if(client.email === toUser.email) {
        client.ws.send(JSON.stringify(result));
      }
    });

    return result;
  }
}