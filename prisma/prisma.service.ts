import { INestApplication, Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.$connect();
  }

  async onApplicationShutdown(signal?: string) {
    if (signal) console.log(`Received signal to shut down: ${signal}`);
    await this.$disconnect();
  }
}
