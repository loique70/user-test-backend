import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id, deleted: false },
    });

    if (!user) throw new NotAcceptableException('User Not Found');
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
      where: { id:id },
      data: { deleted: true },
    });
  }

  async desable(id: number) {
    return await this.prismaService.users.update({
      where: { id:id },
      data: { isActive: false },
    });
  }
}
