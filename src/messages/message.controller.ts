import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.sendMessage(dto);
  }

  @Get(':userId/:otherUserId')
  async getMessages(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getMessagesBetween(+userId, +otherUserId);
  }
}
