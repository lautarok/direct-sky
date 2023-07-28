import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DataSource } from 'typeorm'
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      synchronize: true,
      autoLoadEntities: true,
      database: 'chat'
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    RoomsModule
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
