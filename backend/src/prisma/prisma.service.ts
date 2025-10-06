import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // FIX: Cast to `any` to bypass a TypeScript error. This is likely due to
    // a missing `npx prisma generate` step in the development environment, which
    // would correctly type the PrismaClient instance.
    await (this as any).$connect();
  }
}