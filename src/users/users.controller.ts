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
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwAuthGuard)
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.usersService.findOne(id, req);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    userUpdateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, userUpdateDto);
  }

  @UseGuards(JwAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/desable')
  desableAccount(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.desable(id);
  }

  @Get()
  findAllUser() {
    return this.usersService.findAll();
  }
}
