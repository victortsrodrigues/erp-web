import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prismaClient;
