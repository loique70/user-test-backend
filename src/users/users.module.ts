import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  providers: [UsersService, PrismaService, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
