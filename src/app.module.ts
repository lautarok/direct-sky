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
      host: process.env.PROD ? 'db4free.net' : 'localhost',
      port: 3306,
      username: process.env.prod ? 'direct_sky_2023' : 'root',
      password: process.env.prod ? '$DirectSky.2023!' : '',
      synchronize: !process.env.prod,
      autoLoadEntities: true,
      database: process.env.prod ? 'direct_sky_chat' : 'chat'
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
