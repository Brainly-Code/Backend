import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  private logger = new Logger('SocketIoAdapter');

  configure(app: INestApplication) {
    this.createIOServer(app.getHttpServer(), {
      cors: {
        origin: [
          "https://brainlycode.dpdns.org",
          "https://frontend-mdy5.onrender.com",
          "http://localhost:5173",
          "https://backend-hx6c.onrender.com",
        ],
        credentials: true, // Required if using cookies/auth (matches your current config)
      },
      // Optional: Force WebSocket over polling if possible (reduces CORS issues)
      transports: ['websocket', 'polling'],
    });
    this.logger.log('Socket.IO CORS configured');
  }
}