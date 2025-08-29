import { Module } from '@nestjs/common';
import { ChatService } from './message.service';
import { ChatController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
