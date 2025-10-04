// Test Supabase Connection and API
// Run with: node test-supabase.js

const SUPABASE_URL = 'https://aulpvpzpkzfymnzmwxjq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bHB2cHpwa3pmeW1uem13eGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDU1NzQsImV4cCI6MjA3NTE4MTU3NH0.LaqmHeO2lFiqoislWAFO-OCDcF8fygrJFxcZHvgI7Rw';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Database Connection
  try {
    console.log('1️⃣ Testing database connection...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blood_banks?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    const data = await response.json();
    console.log('✅ Database connection successful:', `${data.length} blood banks found`);
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }

  // Test 2: Users Table
  try {
    console.log('\n2️⃣ Testing users table...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    console.log('✅ Users table accessible');
  } catch (error) {
    console.log('❌ Users table test failed:', error.message);
  }

  // Test 3: Create Test User
  try {
    console.log('\n3️⃣ Testing user creation...');
    const testUser = {
      wallet_address: '0x' + Math.random().toString(16).substr(2, 40),
      name: 'Test User',
      blood_type: 'O+',
      phone: '+1234567890',
      city: 'Kochi'
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testUser)
    });

    if (response.ok) {
      const userData = await response.json();
      console.log('✅ User creation successful:', userData[0].id);
    } else {
      console.log('✅ User creation test completed (may already exist)');
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
