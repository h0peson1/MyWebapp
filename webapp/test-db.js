require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function check() {
  console.log("Checking DB connection...");
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  const users = await prisma.user.findMany({
    select: { email: true }
  });
  console.log("Registered Users in Live DB:");
  console.log(users.map(u => u.email));
  process.exit(0);
}
check();
