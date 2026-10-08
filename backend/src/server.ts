import os from 'os';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

function getLocalNetworkIp(): string {
  try {
    const interfaces = os.networkInterfaces();
    const candidates: { name: string; ip: string }[] = [];
    for (const name of Object.keys(interfaces)) {
      if (/vmware|virtual|vEthernet|loopback|tailscale/i.test(name)) continue;
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254.')) {
          candidates.push({ name, ip: net.address });
        }
      }
    }
    const wifi = candidates.find(c => /wi-?fi|wlan/i.test(c.name));
    if (wifi) return wifi.ip;
    const eth = candidates.find(c => /ethernet|eth/i.test(c.name));
    if (eth) return eth.ip;
    if (candidates.length > 0) return candidates[0].ip;
  } catch (e) {
    // fallback
  }
  return 'localhost';
}

async function bootstrap() {
  // Connect database (with automatic fallback to resilient in-memory mode if DB unavailable)
  await connectDatabase();

  const networkIp = getLocalNetworkIp();
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 VOZX RideCompare Server running!`);
    console.log(`💻 Local:   http://localhost:${env.PORT}`);
    console.log(`📱 Network: http://${networkIp}:${env.PORT}`);
    console.log(`🏥 Health:  http://localhost:${env.PORT}/api/health`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`💡 Open http://${networkIp}:${env.PORT} on your mobile, tablet, or laptop`);
    console.log(`=========================================`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server and database connections closed. Bye!');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
