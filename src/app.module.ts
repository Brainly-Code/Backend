/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";

import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
// import {
//   ThrottlerGuard,3
//   ThrottlerModule,
// } from "@nestjs/throttler";
// import { APP_GUARD } from "@nestjs/core";
import { CoursesModule } from "./courses/courses.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { CourseModuleModule } from "./course-module/course-module.module";
import { MiniModuleModule } from "./mini-module/mini-module.module";
import { LessonModule } from "./lesson/lesson.module";
import { VideoModule } from "./video/video.module";
import { LessonVideoModule } from "./lessonVideo/lesson-video.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { ProfileImageModule } from "./profile-image/profile-image.module";
import { ChallengeInstructionsModule } from "./challenge-instructions/challenge-instructions.module";
import { AdminModule } from "./admin/admin.module";
import { AuthoModule } from "./autho/autho.module";
import { AuthModule } from "./auth/auth.module";
//socket import
import { ChatGateway } from "./chat.gateway";
import { ChatModule } from "./messages/message.module";

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CoursesModule,
    ChallengesModule,
    CourseModuleModule,
    MiniModuleModule,
    LessonModule,
    VideoModule,
    LessonVideoModule,
    CloudinaryModule,
    ProfileImageModule,
    ChallengeInstructionsModule,
    AdminModule,
    AuthoModule,
    ChatModule
  ],
  providers: [ChatGateway],
})
export class AppModule {}
