import { prisma } from './db/prisma';

async function testDatabase() {
  try {
    // 1. Connect to Prisma
    await prisma.$connect();

    // 2. Query the User table
    const userCount = await prisma.user.count();

    // 3. Print whether the database connection succeeded
    console.log('Supabase PostgreSQL connected successfully.');

    // 4. Print the number of users
    console.log(`Users: ${userCount}`);
  } catch (error: any) {
    console.error('Supabase PostgreSQL connection failed:');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    // 5. Disconnect cleanly
    await prisma.$disconnect();
  }
}

testDatabase();
