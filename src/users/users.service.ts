import {
  ForbiddenException,
  Get,
  Injectable,
  NotAcceptableException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  authService: any;
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.users.findMany();
  }

  async findOne(id: number, req: Request) {
    const user = await this.prismaService.users.findUnique({
      where: { id, deleted: false },
    });

    if (!user) throw new NotAcceptableException('User Not Found');

    const decodedUser = req.user as { id: number; email: string };

    if (user.id !== decodedUser.id) throw new ForbiddenException();

    delete user.password;

    return user;
  }

  async updateUser(id: number, userUpdateDto: UpdateUserDto) {
    const updateUser = await this.prismaService.users.update({
      where: { id: id },
      data: userUpdateDto,
    });

    if (!updateUser) throw new NotAcceptableException('User Not Found');
    return updateUser;
  }

  async deleteUser(id: number) {
    return await this.prismaService.users.update({
      where: { id: id },
      data: { deleted: true },
    });
  }

  async desable(id: number) {
    return await this.prismaService.users.update({
      where: { id: id },
      data: { isActive: false },
    });
  }
}
