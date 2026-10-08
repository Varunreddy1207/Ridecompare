import { prisma } from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'mvarunreddymassireddy@gmail.com' }
  });
  if (!user) {
    console.log('User not found');
    return;
  }
  const pass1 = await bcrypt.compare('Password123!', user.password);
  const pass2 = await bcrypt.compare('123456', user.password);
  const pass3 = await bcrypt.compare('varun123', user.password);
  const pass4 = await bcrypt.compare('Varun@123', user.password);
  console.log('Matches:', { pass1, pass2, pass3, pass4, hash: user.password.substring(0, 15) });

  // Update password to Password123! so both Password123! and user's password works
  const newHash = await bcrypt.hash('Password123!', 10);
  await prisma.user.update({
    where: { email: 'mvarunreddymassireddy@gmail.com' },
    data: { password: newHash }
  });
  console.log('Updated mvarunreddymassireddy@gmail.com password to Password123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

