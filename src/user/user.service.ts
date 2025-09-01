/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common"; // Import NotFoundException
import { PrismaService } from "src/prisma/prisma.service";
import { GetUser } from "src/decorator";
import { User } from "generated/prisma";
import { EditUserDto } from "./dto";
import * as argon from 'argon2'; // ✅ Use argon2

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getMe(@GetUser() user: User) {
    //return the user from the payload
    return user; // Return only plain values;
  }

  async getCurrentUser(id: string) {
    const userId = Number(id);

    if (isNaN(userId)) {
      return "The id you provided is not a number"; // Consider throwing a BadRequestException here
    }

    const currentUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      throw new NotFoundException("User not found"); // Throw NestJS exception for consistency
    }

    return currentUser;
  }



async editUser(userId: number, dto: EditUserDto) {
  const previousUser = await this.prisma.user.findUnique({
    where: { id: userId },
  });
    console.log("HIT")
  if (!previousUser) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  let hashedPassword: string | undefined = undefined;
  if (dto.password) {
    hashedPassword = await argon.hash(dto.password); // ✅ Argon2 hash
  }

  const user = await this.prisma.user.update({
    where: { id: userId },
    data: {
      isPremium: dto.isPremium ?? previousUser.isPremium,
      email: dto.email || previousUser.email,
      username: dto.username || previousUser.username,
      ...(hashedPassword && { hash: hashedPassword }), // ✅ assuming your column is named `hash`
    },
  });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async upgradeUserToPro(userId: number) {
    const userToUpgrade = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        isPremium: true,
      },
    });

    if (!userToUpgrade) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isPremium: true,
      },
      select: {
        isPremium: true,
      },
    });

    return updatedUser;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async createOAuthUser(oauthUser: {
    email: string;
    name: string;
    photo?: string;
    provider: 'google' | 'github';
  }) {
    return await this.prisma.user.create({
      data: {
        email: oauthUser.email,
        username: oauthUser.name,
        photo: oauthUser.photo,
        provider: oauthUser.provider,
        hash: "hashedPassword",
        role: 'USER',
        isPremium: false,
      },
    });
  }
}
