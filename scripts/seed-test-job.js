// Script to create a test job in the database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestJob() {
  try {
    console.log('Creating test job...');
    
    // First, get or create a test user
    const testUser = await getOrCreateTestUser();
    
    // Create a test job
    const job = await prisma.job.create({
      data: {
        title: "Test Software Developer Position",
        company: "Test Company Ltd",
        location: "Remote",
        description: "This is a test job created for development and testing purposes.",
        requirements: "This is a test job, no real requirements needed.",
        salary: "$80,000 - $120,000",
        type: "Full-time",
      }
    });
    
    console.log(`✅ Created test job with ID: ${job.id}`);
    console.log('Job details:', job);
    
    // Create a test position linked to the user
    const position = await prisma.position.create({
      data: {
        title: "Test Position",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "This is a test position created for development purposes.",
        requirements: "This is a test position, no real requirements.",
        status: "Open",
        userId: testUser.id
      }
    });
    
    console.log(`✅ Created test position with ID: ${position.id}`);
    console.log('Position details:', position);
    
    return { job, position };
  } catch (error) {
    console.error('❌ Error creating test job:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getOrCreateTestUser() {
  try {
    // First, check if we already have a test user
    const existingUser = await prisma.user.findFirst();
    
    if (existingUser) {
      console.log('✅ Using existing user:', existingUser.id);
      return existingUser;
    }
    
    // If no users exist, create a test user
    console.log('No existing users found. Creating test user...');
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        clerkId: "test_clerk_id",
      }
    });
    
    console.log(`✅ Created test user with ID: ${testUser.id}`);
    return testUser;
  } catch (error) {
    console.error('❌ Error getting/creating test user:', error);
    throw error;
  }
}

// Run the seed function
seedTestJob()
  .then(({ job, position }) => {
    console.log('\n✅ Test data created successfully.');
    console.log('\nYou can use these IDs for testing:');
    console.log(`Job ID: ${job.id}`);
    console.log(`Position ID: ${position.id}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Seed operation failed:', error);
    process.exit(1);
  }); 