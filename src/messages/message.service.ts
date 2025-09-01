import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }

  async sendMessage(dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: dto.content,
        type: dto.type || 'text',
        senderId: dto.senderId,
        receiverId: dto.receiverId,
      },
    });
  }

  async getMessagesBetween(userId: number, otherUserId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUnreadCount(userId: number) {
    // Group by sender, count unread messages for this recipient
    return this.prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: userId,
        read: false,
      },
      _count: { id: true }
    });
  }
}
