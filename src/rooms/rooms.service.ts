import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { UUID } from 'crypto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(user: { id: number }) {
    const matchRooms = await this.roomsRepository.find({
      where: [
        { user1: user.id },
        { user2: user.id }
      ]
    });

    const result = await Promise.all(matchRooms.map(async room => {
      const lastMessage = await this.messagesRepository.findOne({
        where: {
          room: room.roomId
        },
        order: { id: 'DESC' }
      });

      const lastMessageFrom = await this.usersRepository.findOneBy({
        id: lastMessage.fromUser
      });

      const withUser = await this.usersRepository.findOneBy({
        id: room.user1 === user.id ? room.user2 : room.user1
      });

      return {
        id: room.roomId,
        withUser: {
          email: withUser.email,
          nickname: withUser.nickname
        },
        lastMessage: {
          message: lastMessage.message,
          date: lastMessage.createdAt.toISOString(),
          from: {
            email: lastMessageFrom.email,
            nickname: lastMessageFrom.nickname
          }
        }
      }
    }));

    return result.sort((a, b) => (
      new Date(b.lastMessage.date).getTime()
        - new Date(a.lastMessage.date).getTime()
    ));
  }

  async findMessages(roomId: UUID, user: { id: number }) {
    const room = await this.roomsRepository.findOne({
      where: [
        { roomId, user1: user.id },
        { roomId, user2: user.id }
      ]
    });

    if(!room) {
      throw new NotFoundException();
    }

    const messages = await this.messagesRepository.find({
      take: 100,
      order: {
        id: 'DESC'
      },
      where: {
        room: roomId
      }
    });

    return await Promise.all(messages.map(async message => {
      const fromUser = await this.usersRepository.findOneBy({
        id: message.fromUser
      })

      return {
        message: message.message,
        date: message.createdAt,
        from: {
          email: fromUser.email,
          nickname: fromUser.nickname
        }
      }
    }));
  }
}
