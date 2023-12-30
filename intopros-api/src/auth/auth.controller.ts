import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../@guards/local-auth.guard';
import { AuthService } from './auth.service';

import { CreateUserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import {
  PasswordResetFinalDto,
  PasswordResetInitDto,
} from './dto/passwordReset.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() input: CreateUserDto) {
    const resData = await this.authService.register(input);

    return {
      message: 'Successfully registered user!',
      data: resData,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Request() req: any) {
    const resData = this.authService.login(req.user);

    return {
      message: 'Successfully logged in!',
      data: resData,
    };
  }

  @Post('reset-password')
  async initiatePasswordReset(@Body() input: PasswordResetInitDto) {
    const resData = await this.authService.initiatePasswordReset(input);

    return {
      message: 'Successfully initiated password reset!',
      data: resData,
    };
  }

  @Patch('reset-password')
  async finalizePasswordReset(@Body() input: PasswordResetFinalDto) {
    const resData = await this.authService.finalizePasswordReset(input);

    return {
      message: 'Successfully reset password!',
      data: resData,
    };
  }
}
