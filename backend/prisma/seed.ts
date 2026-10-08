import { PrismaClient, Provider, VehicleType, RideStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'alex@ridecompare.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      email: 'alex@ridecompare.com',
      phone: '+919876543210',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  });

  console.log(`👤 Seeded user: ${demoUser.name} (${demoUser.email})`);

  // 2. Seed Saved Locations
  const savedLocations = [
    {
      userId: demoUser.id,
      name: 'Home',
      address: 'Shahupuri 3rd Lane, Kolhapur, Maharashtra 416001',
      latitude: 16.7042,
      longitude: 74.2425
    },
    {
      userId: demoUser.id,
      name: 'College',
      address: 'Sanjay Ghodawat University, Atigre, Kolhapur 416118',
      latitude: 16.7450,
      longitude: 74.3720
    },
    {
      userId: demoUser.id,
      name: 'Office',
      address: 'DYP City Mall, Kawala Naka, Kolhapur 416003',
      latitude: 16.7088,
      longitude: 74.2512
    },
    {
      userId: demoUser.id,
      name: 'Airport',
      address: 'Kolhapur Airport (Ujalaiwadi), Kolhapur 416004',
      latitude: 16.6644,
      longitude: 74.2811
    }
  ];

  for (const loc of savedLocations) {
    const existing = await prisma.savedLocation.findFirst({
      where: { userId: demoUser.id, name: loc.name }
    });
    if (!existing) {
      await prisma.savedLocation.create({ data: loc });
    }
  }
  console.log(`📍 Seeded saved locations`);

  // 3. Seed Ride History
  const historyEntries = [
    {
      userId: demoUser.id,
      provider: Provider.RAPIDO,
      vehicleType: VehicleType.BIKE,
      pickupAddress: 'Shahupuri, Kolhapur',
      destinationAddress: 'Sanjay Ghodawat University, Kolhapur',
      price: 78,
      currency: 'INR',
      status: 'COMPLETED',
      rideDate: new Date(Date.now() - 2 * 3600 * 1000)
    },
    {
      userId: demoUser.id,
      provider: Provider.OLA,
      vehicleType: VehicleType.AUTO,
      pickupAddress: 'Mahalaxmi Temple, Kolhapur',
      destinationAddress: 'DYP City Mall, Kolhapur',
      price: 135,
      currency: 'INR',
      status: 'COMPLETED',
      rideDate: new Date(Date.now() - 24 * 3600 * 1000)
    },
    {
      userId: demoUser.id,
      provider: Provider.UBER,
      vehicleType: VehicleType.CAR,
      pickupAddress: 'Central Bus Stand (CBS), Kolhapur',
      destinationAddress: 'Kolhapur Airport (Ujalaiwadi)',
      price: 245,
      currency: 'INR',
      status: 'COMPLETED',
      rideDate: new Date(Date.now() - 48 * 3600 * 1000)
    }
  ];

  for (const hist of historyEntries) {
    await prisma.rideHistory.create({ data: hist });
  }
  console.log(`📜 Seeded ride history`);

  // 4. Seed Notifications
  const notifications = [
    {
      userId: demoUser.id,
      title: 'Price Drop Alert',
      message: 'Rapido Bike prices are down 15% in your area today.',
      type: 'PRICE_DROP',
      isRead: false
    },
    {
      userId: demoUser.id,
      title: 'Welcome to VOZX RideCompare',
      message: 'Compare prices between Rapido, Ola, and Uber to save on every ride.',
      type: 'WELCOME',
      isRead: true
    }
  ];

  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }
  console.log(`🔔 Seeded notifications`);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
