import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail/mail.service';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, AuthService,JwtService,MailService],
})
export class AppModule {}
