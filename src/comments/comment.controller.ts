import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtGuard } from '../guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return this.commentService.findAll();
  }
}
