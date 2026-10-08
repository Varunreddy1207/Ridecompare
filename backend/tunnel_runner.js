const { exec } = require('child_process');

function startTunnel() {
  console.log('Starting localtunnel on port 5000...');
  const proc = exec('npx localtunnel --port 5000');
  
  proc.stdout.on('data', data => {
    process.stdout.write(data);
  });
  
  proc.stderr.on('data', data => {
    process.stderr.write(data);
  });
  
  proc.on('close', code => {
    console.log(`Localtunnel disconnected (code ${code}). Reconnecting in 3s...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();

