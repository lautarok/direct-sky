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
      host: process.env.MYSQL_HOSTNAME || 'localhost',
      port: 3306,
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      synchronize: !process.env.PROD,
      autoLoadEntities: true,
      database: process.env.MYSQL_DATABASE || 'chat'
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
