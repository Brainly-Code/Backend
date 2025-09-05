import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    const newComment = await this.prisma.comment.create({
      data: {
        message: dto.message,
        userId: dto.userId,
      },
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Community Page" <${process.env.EMAIL_USER}>`,
      to: 'chrisnshuti943@gmail.com',
      subject: 'New Comment Submitted',
      text: `User ID: ${dto.userId ?? 'Anonymous'}\n\nComment:\n${dto.message}`,
    });

    return newComment;
  }

  async findAll() {
    return this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
