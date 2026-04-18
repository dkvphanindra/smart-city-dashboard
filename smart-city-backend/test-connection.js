// Comprehensive Connection Test Script
// Run this to verify all connections
const fetch = require('node-fetch');
const testBackendConnection = async () => {
  console.log('\n🔍 TESTING BACKEND CONNECTION...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Endpoint...');
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    console.log('👉 Make sure backend is running: npm run dev');
    return false;
  }

  // Test 2: User Registration
  try {
    console.log('\n2️⃣ Testing User Registration...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'test123',
      }),
    });
    const registerData = await registerRes.json();
    console.log('✅ Registration:', registerData);

    if (!registerData.success) {
      console.error('❌ Registration failed:', registerData.message);
      return false;
    }

    // Test 3: User Login
    console.log('\n3️⃣ Testing User Login...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.data.email,
        password: 'test123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('✅ Login:', loginData);

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return false;
    }

    // Test 4: Verify Token
    if (loginData.data.token) {
      console.log('\n4️⃣ Verifying JWT Token...');
      console.log('✅ Token Generated:', loginData.data.token.substring(0, 20) + '...');
    }

    console.log('\n✅ ALL BACKEND TESTS PASSED!\n');
    return true;
  } catch (error) {
    console.error('❌ Auth Test Failed:', error.message);
    return false;
  }
};

// Run tests
testBackendConnection().then(success => {
  if (success) {
    console.log('🎉 Backend is fully operational!');
    console.log('📝 Frontend should now be able to connect');
  } else {
    console.log('⚠️ Backend has issues. Check errors above.');
  }
});
