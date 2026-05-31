
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- Debugging Challenges ---");

  const challenges = await prisma.challenge.findMany();
  challenges.forEach(c => {
    console.log(`ID: ${c.id}, Title: "${c.title}", Marks: ${c.marks}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
