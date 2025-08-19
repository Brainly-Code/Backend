/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createChallengeInstructionDto, updateChallengeInstructionDto } from './dto';

@Injectable()
export class ChallengeInstructionsService {
  constructor(private prisma: PrismaService) {}

  async createChallengeInstruction( dto: createChallengeInstructionDto ) {
    return this.prisma.challengeInstructions.create({
      data: {
        challengeId: dto.challengeId,
        number: dto.number,
        instruction: dto.instruction
      }
    })
  }

  async getInstructionsForChallenge( id: string ) {
    const challengeId = Number(id);

    if(isNaN(challengeId)){
      return "challengeid is not a number";
    }

    try {
      const challengeInstructions = await this.prisma.challengeInstructions.findMany({
        where: {
          challengeId: challengeId,
        }
      })

      return challengeInstructions;
    } catch (error) {
      console.log(error)
      return "Instructions not found";
    }
  }

  async updateChallengeInstruction(id: string, dto: updateChallengeInstructionDto) {
    const instructionId = Number(id);

    if(isNaN(instructionId)){
      return "Instruction id is not a number";
    }

    try {
      const updatedInstruction = await this.prisma.challengeInstructions.update({
        where: { id: instructionId },
        data: dto
      });

      return updatedInstruction;
    } catch (error) {
      console.log(error);
      return "Failed to update instruction";
    }
  }

  async deleteChallengeInstruction(id: string) {
    const instructionId = Number(id);

    if(isNaN(instructionId)){
      return "Instruction id is not a number";
    }

    try {
      await this.prisma.challengeInstructions.delete({
        where: { id: instructionId }
      });

      return { message: "Instruction deleted successfully" };
    } catch (error) {
      console.log(error);
      return "Failed to delete instruction";
    }
  }
}   
