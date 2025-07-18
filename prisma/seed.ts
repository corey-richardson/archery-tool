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

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
