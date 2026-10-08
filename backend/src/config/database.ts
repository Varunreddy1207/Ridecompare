import { prisma } from '../db/prisma';

export { prisma };

import bcrypt from 'bcryptjs';

export let isDatabaseConnected = false;

export async function connectDatabase(): Promise<boolean> {
  try {
    await prisma.$connect();
    isDatabaseConnected = true;
    console.log('✅ PostgreSQL database connected successfully via Prisma.');

    // Ensure demo user exists in database with valid credentials
    try {
      const demoEmail = 'varunreddy@gmail.com';
      const demoPasswordHash = bcrypt.hashSync('Password123!', 10);
      await prisma.user.upsert({
        where: { email: demoEmail },
        update: {
          password: demoPasswordHash,
          name: 'Varun Reddy'
        },
        create: {
          id: 'demo-user-1',
          name: 'Varun Reddy',
          email: demoEmail,
          phone: '+91 98765 43210',
          password: demoPasswordHash
        }
      });
      console.log('✅ Demo user (varunreddy@gmail.com) verified in PostgreSQL.');
    } catch (seedErr: any) {
      console.warn('Note: Demo user seeding skipped/fallback:', seedErr.message);
    }

    return true;
  } catch (error) {
    isDatabaseConnected = false;
    console.warn('⚠️ Warning: PostgreSQL not reachable at DATABASE_URL. Running with resilient local memory fallback.');
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    isDatabaseConnected = false;
  } catch (error) {
    // Ignore disconnect errors
  }
}
