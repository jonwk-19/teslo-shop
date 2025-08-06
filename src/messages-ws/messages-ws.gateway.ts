import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto.';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server; //? tine toda la info del server
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    // console.log('Client connected: ', client.id)

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id)
    } catch (error) {
      console.log(error)
      client.disconnect()
      return;
    }

    // console.log({payload})

    console.log({connectados: this.messagesWsService.getConnectedClients()})

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()) //? para decirle algo al cliente
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected: ', client.id)
    this.messagesWsService.removeClient(client.id)
    console.log({connectados: this.messagesWsService.getConnectedClients()})

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()) //? para decirle algo al cliente
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto){

    //! Solo emite al cliente que envio
    //message-from-server
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })

    //! Emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message!!'
    // })

    //? Usar clientes
    // client.join(rooms)
    // this.wss.to(room)

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })
  }

}
