import { prisma } from '../src/config/database';

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, createdAt: true } });
  console.log('Database Users:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

