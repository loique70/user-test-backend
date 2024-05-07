import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { lastName, firstName, userName, password, email } = createAuthDto;

    const foundUser = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (foundUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await this.hashPassword(password);

    const activationLink = uuidv4();

    await this.prismaService.users.create({
      data: {
        lastName,
        firstName,
        userName,
        password: hashedPassword,
        email,
        isActive: false,
        activationLink,
      },
    });

    await this.mailService.sendActivationEmail(email, activationLink);

    return {
      message:
        'Registration was successful. Please check your email for activation instructions.',
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;

    const foundUser = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!foundUser.isActive)
      throw new BadRequestException('Account is not Activated');

    if (!foundUser) throw new BadRequestException('Wrong credentials');

    const isMatch = await this.comparePassword({
      password,
      hash: foundUser.password,
    });

    if (!isMatch) throw new BadRequestException('Wrong credentials');

    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    if (!token) throw new ForbiddenException();

    res.cookie('token', token);

    return res.send({ message: 'Logged in succefully' });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logout successful' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;

    return this.jwtService.signAsync(payload, { secret: jwtSecret });
  }

  async activateAccount(activationLink: string) {
    const user = await this.prismaService.users.findUnique({
      where: { activationLink },
    });

    if (!user) throw new BadRequestException('Invalid activation link');

    await this.prismaService.users.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    return { message: 'Account successfully activated' };
  }

  async getUserInfo(token: string): Promise<CreateAuthDto> {
    try {
      const decoded = this.jwtService.verify(token, { secret: jwtSecret });
      const userId = decoded.id;

      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
      });

      if (!user) throw new BadRequestException('User not found');

      return user;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
