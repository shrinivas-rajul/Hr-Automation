// Script to test database connection
const { PrismaClient } = require('@prisma/client');

// Load environment variables from .env
require('dotenv').config();

// Create Prisma client with detailed logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// Log the database URL (hide credentials)
console.log('Testing connection to database:');
console.log('Database URL format (without credentials):', 
  process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, "//***:***@") || 'DATABASE_URL not set');

async function testConnection() {
  try {
    // Simple query to test connection
    console.log('Attempting to connect...');
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    
    console.log('✅ Connection successful!', result);
    
    // Get database version to verify we can actually query the database
    const versionResult = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', versionResult);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    
    // Provide troubleshooting advice
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify your DATABASE_URL in .env is correct');
    console.log('2. Ensure your NeonDB instance is running');
    console.log('3. Check if your IP is allowed in NeonDB\'s IP allowlist');
    console.log('4. Ensure the database exists and user has proper permissions');
    console.log('5. Try accessing the NeonDB dashboard to verify the database is online');
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(e => {
    console.error('Error in test script:', e);
    process.exit(1);
  }); 