// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const starterPassword = 'hunter2';
  const hashed = await bcrypt.hash(starterPassword, 10);

  // Create or find a user
  const user = await prisma.user.upsert({
    where: { email: 'archer@example.com' },
    update: {
        hashedPassword: hashed,
    },
    create: {
      email: 'archer@example.com',
      name: 'Robin Hood',
      hashedPassword: hashed,
    },
  });

  // Create or find a club
  const club = await prisma.club.upsert({
    where: { name: 'Sherwood Archery Club' },
    update: {},
    create: {
      name: 'Sherwood Archery Club',
    },
  });

  // Link user to club via ClubMembership
  await prisma.clubMembership.upsert({
    where: {
      userId_clubId: {
        userId: user.id,
        clubId: club.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      clubId: club.id,
      roles: ['MEMBER', "ADMIN"], // use any MembershipRole enum values
    },
  });

  // Create a RecordsSummary for the user
  await prisma.recordsSummary.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      indoorClassification: 'UNCLASSIFIED',
      outdoorClassification: 'B1',
      outdoorBadgeGiven: 'B2',
      indoorHandicap: 50,
      outdoorHandicap: 60,
      // Add other fields as needed
    },
  });

  // Create a sample Score for the user
  await prisma.scores.create({
    data: {
      userId: user.id,
      dateShot: new Date('2025-07-19T10:00:00Z'),
      roundName: 'Portsmouth',
      roundType: 'INDOOR',
      bowstyle: 'RECURVE',
      score: 540,
      xs: 10,
      tens: 20,
      nines: 30,
      hits: 60,
      competitionLevel: 'PRACTICE',
      ageCategory: 'SENIOR',
      notes: 'Seeded score',
      roundIndoorClassification: 'UNCLASSIFIED',
      roundOutdoorClassification: null,
      roundHandicap: 50,
      submittedAt: new Date('2025-07-21T10:00:00Z'),
      processedAt: new Date(),
    },
  });

    await prisma.scores.create({
    data: {
      userId: user.id,
      dateShot: new Date('2025-07-23T10:00:00Z'),
      roundName: 'WA 18m',
      roundType: 'INDOOR',
      bowstyle: 'RECURVE',
      score: 523,
      xs: 10,
      tens: 20,
      nines: 30,
      hits: 60,
      competitionLevel: 'PRACTICE',
      ageCategory: 'SENIOR',
      notes: 'Seeded score',
      submittedAt: new Date(),
      processedAt: null,
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
