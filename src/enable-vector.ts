import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected. Enabling "vector" extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('Successfully enabled "vector" extension.');
  } catch (error) {
    console.error('Error enabling extension:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
