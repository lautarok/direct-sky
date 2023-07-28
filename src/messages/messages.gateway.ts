import {
  SubscribeMessage,
  WebSocketGateway,
  WsException
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

export const clients = [];

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    private jwtService: JwtService
  ) {}

  @SubscribeMessage('receiveMessages')
  handleMessage(client: any, { token, sessionUUID }: any): string {
    const tokenPayload = this.jwtService.decode(token);

    if(!tokenPayload) {
      return JSON.stringify({error: 'Invalid token'});
    }
    
    clients.push({
      email: tokenPayload['email'],
      ws: client,
      uuid: sessionUUID
    })

    return JSON.stringify({ success: true });
  }
}