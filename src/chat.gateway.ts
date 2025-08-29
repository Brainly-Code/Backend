import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://frontend-mdy5.onrender.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    console.log(`Socket ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('sendDM')
  handleSendDM(@MessageBody() data: any) {
    const { senderId, receiverId, content, type } = data;
    const roomId = [senderId, receiverId].sort().join('-'); // unique room

  const message = {
    senderId: senderId,
    receiverId: receiverId,
    content,
    type,
    id: Date.now(),
  };

    this.server.to(roomId).emit('newDM', message);
  }
}
