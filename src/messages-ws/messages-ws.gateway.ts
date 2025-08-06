import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server; //? tine toda la info del server
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log('Client connected: ', client.id)
    this.messagesWsService.registerClient(client)
    console.log({connectados: this.messagesWsService.getConnectedClients()})

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()) //? para decirle algo al cliente
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected: ', client.id)
    this.messagesWsService.removeClient(client.id)
    console.log({connectados: this.messagesWsService.getConnectedClients()})

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()) //? para decirle algo al cliente
  }

}
