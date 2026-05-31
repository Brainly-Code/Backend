
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- Fixing Data ---");

  // 1. Update Challenges with 0 marks to 10
  const updatedChallenges = await prisma.challenge.updateMany({
    where: { marks: 0 },
    data: { marks: 10 }
  });
  console.log(`Updated ${updatedChallenges.count} challenges to have 10 marks.`);

  // 2. Backfill CompletedChallenges
  // We need to loop because we need to look up each challenge's marks
  const completions = await prisma.completedChallenges.findMany({
    where: { correct: 'WRIGHT' },
    include: { challenge: true }
  });

  let updatedCount = 0;
  for (const c of completions) {
    const shouldBeMarks = c.challenge?.marks || 0;
    if (c.marks !== shouldBeMarks) {
      await prisma.completedChallenges.update({
        where: { id: c.id },
        data: { marks: shouldBeMarks }
      });
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} completions to have correct marks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
