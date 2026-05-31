import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileImageService } from './profile-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtGuard } from '../guard';
@Controller('profile-image')
export class ProfileImageController {
  constructor(private profileImageService: ProfileImageService) { }

  @UseGuards(JwtGuard)
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, cb) => {
        console.log("Filter run")
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only JPEG and PNG images are allowed'), false);
        }
      },
    }),
  )
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.profileImageService.uploadProfileImage(id, image);
  }

  @Get(':id')
  getProfileImage(@Param('id') id: string) {
    return this.profileImageService.getProfileImage(id);
  }

  @Get('')
  getProfileImages() {
    return this.profileImageService.getProfileImages();
  }

}
