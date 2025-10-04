// Test Supabase Connection and API
// Run with: node test-supabase.js

const SUPABASE_URL = 'https://nigxqmizirtccedoezhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZ3hxbWl6aXJ0Y2NlZG9lemhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Mjc0ODUsImV4cCI6MjA3NTAwMzQ4NX0.TgaqzI4PRfR54znLCInytGpci4gmtL7QVo258KPXfo8';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${SUPABASE_URL}/functions/v1/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Blood Banks API
  try {
    console.log('\n2️⃣ Testing blood banks endpoint...');
    const banksResponse = await fetch(`${SUPABASE_URL}/functions/v1/blood-banks`);
    const banksData = await banksResponse.json();
    console.log('✅ Blood banks:', banksData.success ? `${banksData.bloodBanks.length} banks found` : 'Failed');
  } catch (error) {
    console.log('❌ Blood banks test failed:', error.message);
  }

  // Test 3: Database Connection
  try {
    console.log('\n3️⃣ Testing database connection...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('blood_banks')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }

  // Test 4: Create Test User
  try {
    console.log('\n4️⃣ Testing user creation...');
    const testUser = {
      walletAddress: '0x' + Math.random().toString(16).substr(2, 40),
      name: 'Test User',
      bloodType: 'O+',
      phone: '+1234567890',
      city: 'Kochi'
    };

    const userResponse = await fetch(`${SUPABASE_URL}/functions/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const userData = await userResponse.json();
    console.log('✅ User creation:', userData.success ? 'Success' : 'Failed');
    
    if (userData.success) {
      console.log('   User ID:', userData.user.id);
      console.log('   Profile complete:', userData.user.profile_complete);
    }
  } catch (error) {
    console.log('❌ User creation test failed:', error.message);
  }

  console.log('\n🎉 Supabase testing complete!');
  console.log('\n📝 Summary:');
  console.log('- If all tests passed, your Supabase setup is working correctly');
  console.log('- If tests failed, check your project configuration');
  console.log('- Make sure Edge Functions are deployed');
  console.log('- Verify environment variables are set correctly');
}

// Run the tests
testSupabaseConnection().catch(console.error);
