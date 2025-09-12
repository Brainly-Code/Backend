import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { CreateCourseResourceDto } from './dto/create-course-resource.dto';

@Injectable()
export class CourseResourceService {
  constructor(private prisma: PrismaService) {}

async uploadResource(
  file: Express.Multer.File, 
  dto: CreateCourseResourceDto, 
  courseId: number
) {
  // 1. Upload to Cloudinary
  const url = await new Promise<string>((resolve, reject) => {
    const extension = file.originalname.split('.').pop(); // get file extension

    cloudinary.uploader.upload_stream(
      { 
        folder: 'course-resources',
        resource_type: 'raw',
        use_filename: true,
        public_id: file.originalname.split('.')[0],
        type: "upload",
        filename_override: file.originalname,
      },
      (error, result: any) => {
        if (error) return reject(error);
        if (!result?.secure_url) return reject(new Error('Upload failed'));

        // Ensure URL contains the extension
        const urlWithExtension = result.secure_url.includes(`.${extension}`)
          ? result.secure_url
          : `${result.secure_url}.${extension}`;

        resolve(urlWithExtension);
      },
    ).end(file.buffer);
  });

  // 2. Get highest resource number
  const lastResource = await this.prisma.courseResource.findFirst({
    where: { courseId },
    orderBy: { number: 'desc' },
  });

  // 3. Get highest module number
  const lastModule = await this.prisma.courseModule.findFirst({
    where: { courseId },
    orderBy: { number: 'desc' },
  });

  // 4. Get highest video number
  const lastVideo = await this.prisma.video.findFirst({
    where: { courseId },
    orderBy: { number: 'desc' },
  });

  // 5. Pick the max number among all three
  const lastResourceNumber = lastResource?.number || 0;
  const lastModuleNumber = lastModule?.number || 0;
  const lastVideoNumber = lastVideo?.number || 0;

  const nextNumber = Math.max(
    lastResourceNumber, 
    lastModuleNumber, 
    lastVideoNumber
  ) + 1;

  // 6. Save resource
  const extension = file.originalname.split('.').pop() || 'unknown';
  return this.prisma.courseResource.create({
    data: {
      title: dto.title,
      type: dto.type || extension, // fallback to extension
      url,
      course: { connect: { id: courseId } },
      number: nextNumber,
    },
  });
}



  async getResourcesByCourse(courseId: number) {
    return this.prisma.courseResource.findMany({
      where: { courseId },
      orderBy: { number: 'asc' }, // keep sequential order
    });
  }

  async deleteResource(resourceId: number) {
    const resource = await this.prisma.courseResource.findUnique({
      where: { id: resourceId },
    });
    if (!resource) throw new NotFoundException('Resource not found');

    // Optional: delete from Cloudinary if needed
    // cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, ...)

    return this.prisma.courseResource.delete({ where: { id: resourceId } });
  }
}
