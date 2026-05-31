
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recent = await prisma.completedChallenges.findMany({
    where: { correct: 'WRIGHT' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { challenge: true }
  });

  recent.forEach(r => {
    console.log(`CM:${r.challenge?.marks} AM:${r.marks}`);
  });
}

main()
  .catch((e) => process.exit(1))
  .finally(async () => await prisma.$disconnect());
