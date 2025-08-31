import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const passwordHash = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash,
    },
  });

  console.log('✅ Users created:', { user1: user1.email, user2: user2.email });

  // Create sample todos for user1
  const todos1 = await Promise.all([
    prisma.todo.create({
      data: {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and vegetables',
        userId: user1.id,
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Complete project',
        description: 'Finish the todo list API implementation',
        userId: user1.id,
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Exercise',
        description: 'Go for a 30-minute run',
        userId: user1.id,
      },
    }),
  ]);

  // Create sample todos for user2
  const todos2 = await Promise.all([
    prisma.todo.create({
      data: {
        title: 'Read book',
        description: 'Finish reading "Clean Code"',
        userId: user2.id,
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Call mom',
        description: 'Weekly check-in call',
        userId: user2.id,
      },
    }),
  ]);

  console.log('✅ Todos created:', {
    user1Todos: todos1.length,
    user2Todos: todos2.length,
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
