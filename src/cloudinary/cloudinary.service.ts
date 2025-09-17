/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
      timeout: 1200000,
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) {
            return reject(new Error('Upload failed or no URL returned'));
          }
          resolve(result.secure_url);
        },
      ).end(file.buffer);
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'profile-images', resource_type: 'image' },
        (error, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) {
            return reject(new Error('Upload failed or no URL returned'));
          }
          resolve(result.secure_url);
        },
      ).end(file.buffer);
    });
  }

   async uploadDocument(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const extension = file.originalname.split('.').pop(); // get original extension
      cloudinary.uploader.upload_stream(
        {
          folder: 'course-documents',
          resource_type: 'raw', // important for pdf, ppt, pptx, etc.
          public_id: `${file.originalname.split('.')[0]}`, // optional: use original filename
        },
        (error, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) {
            return reject(new Error('Upload failed or no URL returned'));
          }
          // append extension to URL if needed
          const urlWithExtension = result.secure_url.includes(`.${extension}`)
            ? result.secure_url
            : `${result.secure_url}.${extension}`;
          resolve(urlWithExtension);
        },
      ).end(file.buffer);
    });
  }

     async uploadChallengeDocument(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const extension = file.originalname.split('.').pop(); // get original extension
      cloudinary.uploader.upload_stream(
        {
          folder: 'challenge-documents',
          resource_type: 'raw', // important for pdf, ppt, pptx, etc.
          public_id: `${file.originalname.split('.')[0]}`, // optional: use original filename
        },
        (error, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) {
            return reject(new Error('Upload failed or no URL returned'));
          }
          // append extension to URL if needed
          const urlWithExtension = result.secure_url.includes(`.${extension}`)
            ? result.secure_url
            : `${result.secure_url}.${extension}`;
          resolve(urlWithExtension);
        },
      ).end(file.buffer);
    });
  }


  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error, _result) => {
          if (error) return reject(error);
          resolve();
        },
      );
    }
  );
  }

  getPublicIdFromUrl(imageUrl: string): string | null {
    try {
      const parts = imageUrl.split('/');
      const filename = parts.pop(); // e.g. 'abcd1234.jpg'
      if (!filename) return null;

      const [publicId] = filename.split('.'); // Remove extension
      const folder = parts.slice(-1)[0]; // e.g. 'profile-images'
      return `${folder}/${publicId}`;
    } catch (err) {
      console.error('Failed to extract publicId from URL:', err);
      return null;
    }
  }
}
function then() {
  throw new Error('Function not implemented.');
}

