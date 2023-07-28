import {
  SubscribeMessage,
  WebSocketGateway,
  WsException
} from '@nestjs/websockets';
import { wsConstants } from 'src/constants';
import { JwtService } from '@nestjs/jwt';

export const clients = [];

@WebSocketGateway(wsConstants.port, {
  cors: {
    origin: wsConstants.origin
  }
})
export class MessagesGateway {
  constructor(
    private jwtService: JwtService
  ) {}

  @SubscribeMessage('receiveMessages')
  handleMessage(client: any, payload: any): string {
    const tokenPayload = this.jwtService.decode(payload);

    if(!tokenPayload) {
      return JSON.stringify({error: 'Invalid token'});
    }
    
    clients.push({
      email: tokenPayload['email'],
      ws: client
    })

    return JSON.stringify({ success: true });
  }
}