import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtGuard } from '../guard';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.sendMessage(dto);
  }

  @Get('unread-count/:userId')
  async getUnreadCount(@Param('userId') userId: string) {
    return this.chatService.getUnreadCount(+userId);
  }

  @Get(':userId/:otherUserId')
  async getMessages(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getMessagesBetween(+userId, +otherUserId);
  }

  @Get('unread/:userId/:otherUserId')
  getUnreadPerSender(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getUnreadMessagesPerSender(+userId, +otherUserId);
  }

  @Get('read/:userId/:otherUserId')
  readMessages(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.readMessages(+userId, +otherUserId);
  }

}
