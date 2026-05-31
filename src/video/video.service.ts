/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 
import { CreateVideoDto } from './dto';

@Injectable()
export class VideoService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

async create(createVideoDto: CreateVideoDto, file: Express.Multer.File) {
  const { title, courseId } = createVideoDto;

  // 1. Upload video to Cloudinary
  const url = await this.cloudinaryService.uploadVideo(file);

  // 2. Get highest video number under the same course
  const lastVideo = await this.prisma.video.findFirst({
    where: { courseId },
    orderBy: { number: 'desc' },
  });

  // 3. Get highest module number under the same course
  const lastModule = await this.prisma.courseModule.findFirst({
    where: { courseId },
    orderBy: { number: 'desc' },
  });

  // 4. Determine next number based on the higher one
  const lastVideoNumber = lastVideo?.number || 0;
  const lastModuleNumber = lastModule?.number || 0;
  const nextNumber = Math.max(lastVideoNumber, lastModuleNumber) + 1;

  // 5. Create video entry with calculated number
  return this.prisma.video.create({
    data: {
      title,
      number: nextNumber,
      courseId,
      url,
    },
  });
}


async findByCourseId(courseId: number) {
  return this.prisma.video.findMany({
    where: { courseId },
    include: { course: true },
  });
}

  async findOne(id: number) {
    return this.prisma.video.findUnique({
      where: { id },
      include: { course: true },
    });
  }

  async remove(id: number) {
    return this.prisma.video.delete({
      where: { id },
    });
  }
}
