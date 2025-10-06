import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USERS_TO_SEED = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: Role.Student },
  { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: Role.Student },
  { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: Role.Instructor },
  { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: Role.Admin },
  { id: 'user-5', name: 'Ethan Hunt', email: 'ethan@example.com', role: Role.Instructor },
];

const COURSES_TO_SEED = [
  {
    id: 'course-1',
    title: 'Introduction to Stock Trading',
    description: 'Learn the fundamentals of stock trading, from market analysis to risk management.',
    instructorId: 'user-3',
    rating: 4.5,
    price: 99.99,
    modules: [
      { id: 'm1-1', title: 'What is the Stock Market?', type: 'article', content: 'The stock market refers to the collection of markets and exchanges where regular activities of buying, selling, and issuance of shares of publicly-held companies take place.', order: 1, duration: 15 },
      { id: 'm1-2', title: 'Reading Stock Charts', type: 'video', content: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4', order: 2, duration: 10 },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Market Analysis Paper',
      description: 'Write a 500-word paper analyzing the recent performance of a publicly traded company of your choice. Discuss its stock chart patterns, recent news, and future outlook.',
    }
  },
  {
    id: 'course-2',
    title: 'Advanced Options Trading',
    description: 'Master complex options strategies to maximize your returns and hedge your positions.',
    instructorId: 'user-5',
    rating: 4.8,
    price: 249.99,
    modules: [
      { id: 'm2-1', title: 'Understanding Calls and Puts', type: 'article', content: 'A call option gives the holder the right to buy a stock and a put option gives the holder the right to sell a stock.', order: 1, duration: 20 },
      { id: 'm2-2', title: 'The Iron Condor Strategy', type: 'video', content: 'https://www.youtube.com/embed/JAr2rUbgGJE', order: 2, duration: 40 },
    ],
  }
];

const ENROLLMENTS_TO_SEED = [
    {
        studentId: 'user-1',
        courseId: 'course-1',
        progress: 50,
    }
];

async function main() {
  console.log('Start seeding...');

  // Clean database
  await prisma.enrollment.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const password = await bcrypt.hash('password123', 10);
  for (const user of USERS_TO_SEED) {
    await prisma.user.create({
      data: {
        ...user,
        password,
      },
    });
  }
  console.log('Seeded users.');

  // Seed Courses, Modules, and Assignments
  for (const course of COURSES_TO_SEED) {
    const { modules, assignment, ...courseData } = course;
    await prisma.course.create({
      data: {
        ...courseData,
        modules: {
          create: modules,
        },
        assignments: assignment ? {
          create: [assignment],
        } : undefined,
      },
    });
  }
  console.log('Seeded courses, modules, and assignments.');

  // Seed Enrollments
  for (const enrollment of ENROLLMENTS_TO_SEED) {
    await prisma.enrollment.create({
        data: enrollment,
    });
  }
  console.log('Seeded enrollments.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
