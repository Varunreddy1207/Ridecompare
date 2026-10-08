import { prisma } from '../src/db/prisma';

const API_BASE = 'http://localhost:5000/api';

async function runVerification() {
  console.log('========================================================');
  console.log('🚀 VOZX RideCompare — SUPABASE AUTH SYSTEM 10-STEP AUDIT');
  console.log('========================================================\n');

  const testEmail = `supabase_audit_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Supabase Audit User';

  let jwtToken = '';
  let registeredUserId = '';

  // -------------------------------------------------------------------------
  // STEP 1: Register test user via POST /api/auth/register
  // -------------------------------------------------------------------------
  console.log('📌 STEP 1: Registering user via POST /api/auth/register...');
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword
    })
  });
  const regData = await regRes.json();
  console.log(`   HTTP Status: ${regRes.status}`);
  console.log(`   Response:`, JSON.stringify(regData, null, 2));

  if (regRes.status !== 201 || !regData.success) {
    throw new Error(`Step 1 Failed: Status ${regRes.status}`);
  }
  registeredUserId = regData.user.id;
  jwtToken = regData.token;
  console.log('   ✅ STEP 1 PASSED: User registered successfully.\n');

  // -------------------------------------------------------------------------
  // STEP 2: Query Supabase User table via Prisma
  // -------------------------------------------------------------------------
  console.log('📌 STEP 2: Querying Supabase PostgreSQL via Prisma...');
  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail.toLowerCase() }
  });

  if (!dbUser) {
    throw new Error('Step 2 Failed: User not found in Supabase database!');
  }
  console.log(`   Found User in Supabase:`);
  console.log(`   - ID: ${dbUser.id}`);
  console.log(`   - Name: ${dbUser.name}`);
  console.log(`   - Email: ${dbUser.email}`);
  console.log(`   - CreatedAt: ${dbUser.createdAt.toISOString()}`);
  console.log('   ✅ STEP 2 PASSED: User record verified in Supabase PostgreSQL.\n');

  // -------------------------------------------------------------------------
  // STEP 3: Verify bcrypt password hash in database
  // -------------------------------------------------------------------------
  console.log('📌 STEP 3: Verifying bcrypt hash in Supabase database...');
  const isBcrypt = dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$');
  const isPlaintext = dbUser.password === testPassword;

  console.log(`   Password starts with bcrypt salt prefix: ${isBcrypt}`);
  console.log(`   Password hash sample: ${dbUser.password.substring(0, 29)}...`);
  console.log(`   Plaintext password exposed: ${isPlaintext}`);

  if (!isBcrypt || isPlaintext) {
    throw new Error('Step 3 Failed: Password is not hashed with bcrypt!');
  }
  console.log('   ✅ STEP 3 PASSED: Password properly hashed with bcrypt.\n');

  // -------------------------------------------------------------------------
  // STEP 4: Login with correct password
  // -------------------------------------------------------------------------
  console.log('📌 STEP 4: Logging in via POST /api/auth/login with correct password...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  const loginData = await loginRes.json();
  console.log(`   HTTP Status: ${loginRes.status}`);
  console.log(`   User: ${loginData.user.name} (${loginData.user.email})`);

  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error(`Step 4 Failed: Login failed with status ${loginRes.status}`);
  }
  jwtToken = loginData.token;
  console.log('   ✅ STEP 4 PASSED: Login succeeded.\n');

  // -------------------------------------------------------------------------
  // STEP 5: Verify valid JWT token
  // -------------------------------------------------------------------------
  console.log('📌 STEP 5: Verifying JWT token structure...');
  const tokenParts = jwtToken.split('.');
  console.log(`   Token segments count: ${tokenParts.length} (Header.Payload.Signature)`);
  if (tokenParts.length !== 3) {
    throw new Error('Step 5 Failed: Token is not a valid 3-part JWT!');
  }
  const payloadJson = Buffer.from(tokenParts[1], 'base64url').toString('utf-8');
  console.log(`   JWT Decoded Payload: ${payloadJson}`);
  console.log('   ✅ STEP 5 PASSED: Valid JWT returned.\n');

  // -------------------------------------------------------------------------
  // STEP 6: Login with wrong password
  // -------------------------------------------------------------------------
  console.log('📌 STEP 6: Attempting login with wrong password...');
  const wrongLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword999!'
    })
  });
  const wrongLoginData = await wrongLoginRes.json();
  console.log(`   HTTP Status: ${wrongLoginRes.status}`);
  console.log(`   Error Response:`, wrongLoginData);

  if (wrongLoginRes.status !== 401) {
    throw new Error(`Step 6 Failed: Expected 401 Unauthorized but got ${wrongLoginRes.status}`);
  }
  console.log('   ✅ STEP 6 PASSED: Invalid password rejected with HTTP 401.\n');

  // -------------------------------------------------------------------------
  // STEP 7: Call GET /api/auth/me with JWT header
  // -------------------------------------------------------------------------
  console.log('📌 STEP 7: Calling GET /api/auth/me with valid JWT...');
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${jwtToken}` }
  });
  const meData = await meRes.json();
  console.log(`   HTTP Status: ${meRes.status}`);
  console.log(`   Authenticated User:`, meData.user || meData.data);

  if (meRes.status !== 200 || !meData.success) {
    throw new Error(`Step 7 Failed: Expected 200 but got ${meRes.status}`);
  }
  console.log('   ✅ STEP 7 PASSED: /api/auth/me returned current user profile.\n');

  // -------------------------------------------------------------------------
  // STEP 8: Call GET /api/auth/me without JWT header
  // -------------------------------------------------------------------------
  console.log('📌 STEP 8: Calling GET /api/auth/me without JWT header...');
  const unauthMeRes = await fetch(`${API_BASE}/auth/me`);
  console.log(`   HTTP Status: ${unauthMeRes.status}`);

  if (unauthMeRes.status !== 401) {
    throw new Error(`Step 8 Failed: Expected 401 Unauthorized but got ${unauthMeRes.status}`);
  }
  console.log('   ✅ STEP 8 PASSED: Protected route rejected unauthenticated request with HTTP 401.\n');

  // -------------------------------------------------------------------------
  // STEP 9: Call GET and PATCH /api/user/profile with JWT and verify in Supabase
  // -------------------------------------------------------------------------
  console.log('📌 STEP 9: Calling GET and PATCH /api/user/profile...');
  const updatedName = 'Supabase Updated Name';
  const updatedPhone = '+91 99887 76655';

  const patchRes = await fetch(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({
      name: updatedName,
      phone: updatedPhone
    })
  });
  const patchData = await patchRes.json();
  console.log(`   PATCH Status: ${patchRes.status}`);
  console.log(`   PATCH Response:`, patchData);

  if (patchRes.status !== 200) {
    throw new Error(`Step 9 Failed: PATCH returned status ${patchRes.status}`);
  }

  // Directly verify change in Supabase via Prisma
  const refreshedDbUser = await prisma.user.findUnique({
    where: { id: registeredUserId }
  });

  if (!refreshedDbUser || refreshedDbUser.name !== updatedName || refreshedDbUser.phone !== updatedPhone) {
    throw new Error('Step 9 Failed: Profile updates not reflected in Supabase PostgreSQL!');
  }
  console.log(`   Verified in Supabase Database: name="${refreshedDbUser.name}", phone="${refreshedDbUser.phone}"`);
  console.log('   ✅ STEP 9 PASSED: Profile updated and persisted in Supabase.\n');

  // -------------------------------------------------------------------------
  // STEP 10: Call POST /api/auth/logout
  // -------------------------------------------------------------------------
  console.log('📌 STEP 10: Calling POST /api/auth/logout...');
  const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  const logoutData = await logoutRes.json();
  console.log(`   HTTP Status: ${logoutRes.status}`);
  console.log(`   Response:`, logoutData);

  if (logoutRes.status !== 200 || !logoutData.success) {
    throw new Error(`Step 10 Failed: Logout failed with status ${logoutRes.status}`);
  }
  console.log('   ✅ STEP 10 PASSED: Logout endpoint completed successfully.\n');

  console.log('========================================================');
  console.log('🎉 ALL 10 AUTHENTICATION & SUPABASE AUDIT STEPS PASSED!');
  console.log('========================================================');

  await prisma.$disconnect();
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

