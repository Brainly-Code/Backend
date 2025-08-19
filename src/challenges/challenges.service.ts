/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChallengeInstructionDto, CreateChallengeSolutionDto } from './dto';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private prisma: PrismaService) {}

  async createChallenge( dto : CreateChallengeDto ) {
    try {
      const challenge = await this.prisma.challenge.create({data: dto})
    
      return {"message": "Challenge created successfully",
        challenge: challenge
      };
    } catch (error) {
      this.logger.error('Request failed:',error);
      throw new NotFoundException("Challenge not found");
    }
  }


  async incrementLikes(challengeId: string) {
    const cId = Number(challengeId);

    if(isNaN(cId)){
      throw new BadRequestException("Invalid challenge Id, must be a number");
    }

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: cId },
    });
  
    try {
    
      if (!challenge) {
        throw new NotFoundException("Challenge not found");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const likedChallenge = await this.prisma.challenge.update({
        where: { id: cId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return {"message": "Challenge liked"};
    } catch (error) {
      this.logger.error('Request failed:',error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChallenges() {
    try {
      const challenges = await this.prisma.challenge.findMany();

      return challenges;
    } catch (error) {
      this.logger.error('Request failed:',error)
      throw new NotFoundException("Unable to get Challenges");
    }
  }

  async getChallengeById(challengeId: string){
    const cId = Number(challengeId)

    if(isNaN(cId)){
      throw new Error ("Invalid challenge Id is not a number");
    }

    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: {
          id: cId
        }
      })
  
      if (!challenge) {
        throw new NotFoundException('Challenge not found');
      }
  
      return challenge;
    } catch (error) {
      this.logger.error('Request failed:',error)
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  async createChallengeInstruction(dto: CreateChallengeInstructionDto ) {
    if(!dto.challengeId) {
      throw new NotFoundException("Challenge not found!");
    }
    try {
      const challengeInstruction = await this.prisma.challengeInstructions.create({
        data: dto
      })
      return {"Message" : "Solution creation was successfull"};
    } catch (error) {
      this.logger.error('Request failed:',error)
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChallengeInstructions(challengeId: number) {
    return await this.prisma.challengeInstructions.findMany({
     where: {
       challengeId: challengeId
     }
    })
  }  

  async createChallengeSolution(dto: CreateChallengeSolutionDto) {
    if(!dto.challengeId) {
      throw new NotFoundException("Challenge not found!");
    }
    try {
      const challengeSolution = await this.prisma.challengeSolutions.create({
        data: dto
      })

      return {"Message" : "Solution creation was successfull"};
    } catch (error) {
      this.logger.error('Request failed:',error)
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChallengeSolution(challengeId: number) {
     return await this.prisma.challengeSolutions.findMany({
      where: {
        challengeId: challengeId
      }
     })
  }
  
}
