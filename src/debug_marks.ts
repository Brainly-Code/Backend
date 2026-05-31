
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- Debugging Marks ---");

  // 1. Check all Challenges and their marks
  const challenges = await prisma.challenge.findMany();
  console.log("\n1. Challenges:");
  challenges.forEach(c => {
    console.log(`- ID: ${c.id}, Title: "${c.title}", Marks: ${c.marks}`);
  });

  // 2. Check CompletedChallenges
  const completions = await prisma.completedChallenges.findMany({
    include: { user: true, challenge: true }
  });
  console.log("\n2. Completed Challenges:");
  completions.forEach(c => {
    console.log(`- ID: ${c.id}, User: ${c.user.username} (${c.userId}), Challenge: ${c.challengeId}, Status: ${c.correct}, MARKS: ${c.marks}`);
  });

  // 3. Check Leaderboard Aggregation manually
  const leaderboard = await prisma.completedChallenges.groupBy({
    by: ['userId'],
    _sum: {
      marks: true,
    },
  });
  console.log("\n3. Leaderboard Aggregation:");
  console.log(JSON.stringify(leaderboard, null, 2));

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
