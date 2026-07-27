import { PrismaClient } from "@/generated/prisma";

// Export a singleton PrismaClient instance to avoid multiple connections in development.
let prisma: PrismaClient;

// Extend the global type to include __prisma for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
 
  if (!global.__prisma) {
    
    global.__prisma = new PrismaClient();
  }
  
  prisma = global.__prisma;
}

export default prisma;
