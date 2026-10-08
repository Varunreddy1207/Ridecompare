import { prisma } from '../src/db/prisma';

async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true
    }
  });

  console.log(`Direct Supabase PostgreSQL Registered Users: ${users.length}`);
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

listUsers();

