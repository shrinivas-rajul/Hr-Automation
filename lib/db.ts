import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Add connection verification
const verifyConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection established successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Run verification in development
if (process.env.NODE_ENV !== 'production') {
  verifyConnection()
}

export default prisma 