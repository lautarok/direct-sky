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
      host: process.env.PROD ? 'localhost' : 'sql10.freemysqlhosting.net',
      port: 3306,
      username: process.env.PROD ? 'root' : 'sql10635856',
      password: process.env.PROD ? '' : '9iryEmeHfa',
      synchronize: !process.env.PROD,
      autoLoadEntities: true,
      database: process.env.PROD ? 'chat' : 'sql10635856'
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
