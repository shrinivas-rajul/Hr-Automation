// Script to verify NeonDB connection and configuration
require('dotenv').config();
const https = require('https');
const { PrismaClient } = require('@prisma/client');

// Extract connection details from DATABASE_URL
function parseDbUrl(url) {
  try {
    if (!url) return { valid: false, error: 'DATABASE_URL is not defined' };
    
    // Basic validation
    if (!url.startsWith('postgresql://')) {
      return { valid: false, error: 'DATABASE_URL must start with postgresql://' };
    }
    
    // Parse URL
    const dbUrl = new URL(url);
    const username = dbUrl.username;
    const password = dbUrl.password ? '[REDACTED]' : 'missing';
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';
    const database = dbUrl.pathname.substring(1); // Remove leading slash
    const params = Object.fromEntries(dbUrl.searchParams.entries());
    
    return {
      valid: true,
      username,
      password,
      host,
      port,
      database,
      params,
      url: url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
    };
  } catch (error) {
    return { valid: false, error: `Failed to parse DATABASE_URL: ${error.message}` };
  }
}

// Check if host is reachable
async function checkHostReachable(hostname) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 5000,
      },
      (res) => {
        resolve({ reachable: true, statusCode: res.statusCode });
      }
    );

    req.on('error', (error) => {
      resolve({ reachable: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ reachable: false, error: 'Connection timed out' });
    });

    req.end();
  });
}

// Test database connection
async function testDbConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ Database connection successful!', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

// Main function
async function main() {
  console.log('NeonDB Connection Verification\n');
  
  // 1. Check DATABASE_URL format
  console.log('1. Checking DATABASE_URL format...');
  const dbConfig = parseDbUrl(process.env.DATABASE_URL);
  
  if (!dbConfig.valid) {
    console.error(`❌ ${dbConfig.error}`);
    return;
  }
  
  console.log('✅ DATABASE_URL format is valid');
  console.log('   Connection details:');
  console.log(`   - URL: ${dbConfig.url}`);
  console.log(`   - Host: ${dbConfig.host}`);
  console.log(`   - Port: ${dbConfig.port}`);
  console.log(`   - Database: ${dbConfig.database}`);
  console.log(`   - Username: ${dbConfig.username}`);
  console.log(`   - Password: ${dbConfig.password ? 'provided' : 'missing'}`);
  console.log(`   - SSL Mode: ${dbConfig.params.sslmode || 'not specified'}`);
  
  // 2. Check if host is reachable
  console.log('\n2. Checking if NeonDB host is reachable...');
  const hostCheck = await checkHostReachable(dbConfig.host);
  
  if (!hostCheck.reachable) {
    console.error(`❌ Host ${dbConfig.host} is not reachable: ${hostCheck.error}`);
    console.log('   Possible reasons:');
    console.log('   - Network connectivity issues');
    console.log('   - NeonDB server might be down');
    console.log('   - Hostname might be incorrect');
    console.log('\n   Recommendation:');
    console.log('   - Verify your DATABASE_URL is correct');
    console.log('   - Check NeonDB status at https://neon.tech/status');
    console.log('   - Try accessing the NeonDB dashboard to verify the project is active');
    return;
  }
  
  console.log(`✅ Host ${dbConfig.host} is reachable`);
  
  // 3. Test database connection
  console.log('\n3. Testing database connection...');
  const dbTest = await testDbConnection();
  
  if (!dbTest.success) {
    console.error('❌ Database connection test failed');
    console.log('   Possible reasons:');
    console.log('   - Username or password might be incorrect');
    console.log('   - Database might not exist');
    console.log('   - Connection parameters might be incorrect');
    console.log('   - NeonDB might be in maintenance mode');
    
    if (dbTest.error && dbTest.error.message) {
      if (dbTest.error.message.includes('password authentication failed')) {
        console.log('\n   The error suggests invalid credentials.');
        console.log('   Please verify your username and password in the DATABASE_URL.');
      } else if (dbTest.error.message.includes('does not exist')) {
        console.log('\n   The error suggests the database does not exist.');
        console.log('   Please check if you specified the correct database name.');
      } else if (dbTest.error.message.includes('connection timeout')) {
        console.log('\n   The connection timed out.');
        console.log('   Your NeonDB instance might be sleeping or there might be network issues.');
      }
    }
    
    return;
  }
  
  console.log('✅ Database connection test passed');
  console.log('\n🎉 All checks passed! Your NeonDB connection is properly configured.\n');
}

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 