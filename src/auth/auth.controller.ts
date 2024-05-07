import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res) {
    return this.authService.login(loginDto, res);
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }

  
  @Get('activate/:link')
  async activate(@Param('link') link: string) {
    return this.authService.activateAccount(link);
  }
}
