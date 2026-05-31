
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- Checking Recent Correct Completions ---");

  const recent = await prisma.completedChallenges.findMany({
    where: { correct: 'WRIGHT' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { challenge: true, user: true }
  });

  recent.forEach(r => {
    console.log(`User: ${r.user.username}, Challenge: "${r.challenge?.title}", ChallengeMarks: ${r.challenge?.marks}, AppliedMarks: ${r.marks}, Status: ${r.correct}`);
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
