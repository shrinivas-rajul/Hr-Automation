// This file validates required environment variables at startup

interface EnvVariable {
  name: string;
  required: boolean;
}

// List of environment variables to validate
const envVariables: EnvVariable[] = [
  { name: 'DATABASE_URL', required: true },
  { name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', required: true },
  { name: 'CLERK_SECRET_KEY', required: true },
  { name: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', required: true },
  { name: 'CLOUDINARY_API_KEY', required: true },
  { name: 'CLOUDINARY_API_SECRET', required: true },
  { name: 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET', required: false },
  { name: 'GMAIL_CLIENT_ID', required: false },
  { name: 'GMAIL_CLIENT_SECRET', required: false },
  { name: 'GMAIL_REFRESH_TOKEN', required: false },
  { name: 'GMAIL_USER', required: false },
  { name: 'GOOGLE_CALENDAR_API_KEY', required: false },
  { name: 'GOOGLE_CALENDAR_CLIENT_ID', required: false },
  { name: 'GOOGLE_CALENDAR_CLIENT_SECRET', required: false },
];

// Function to validate environment variables
export function validateEnv(): void {
  const missingVars: string[] = [];

  for (const { name, required } of envVariables) {
    if (required && !process.env[name]) {
      missingVars.push(name);
    }
  }

  if (missingVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingVars.forEach(name => {
      console.error(`  - ${name}`);
    });
    console.error('\nPlease set these variables in your .env file or deployment environment.\n');
    
    // Only throw in development and test environments
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  } else {
    console.log('✅ All required environment variables are set.');
  }
}

// Run validation once when this module is imported
validateEnv(); 