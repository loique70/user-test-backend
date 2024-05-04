import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUser() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneUser(@Param('id',ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    userUpdateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, userUpdateDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/desable')
  desableAccount(@Param('id', ParseIntPipe) id:number) {
    return this.usersService.desable(id)
  }
}
