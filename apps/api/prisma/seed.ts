import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedMeasurementUnits } from './seeds/measurement-units.js';
import { seedNutrients } from './seeds/nutrients.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set — cannot seed.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const units = await seedMeasurementUnits(prisma);
  console.log(`Seeded ${units} measurement units.`);

  const nutrients = await seedNutrients(prisma);
  console.log(`Seeded ${nutrients} nutrients.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
