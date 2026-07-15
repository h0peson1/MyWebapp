require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

async function check() {
  console.log("Checking DB connection...");
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });
  
  const users = await prisma.user.findMany({
    select: { email: true }
  });
  console.log("Registered Users in Live DB:");
  console.log(users.map(u => u.email));
  process.exit(0);
}
check();
