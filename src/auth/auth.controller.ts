import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';

import { UserLoginDto } from './dto/user-login.dto';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/local-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async userRegistration(@Body() createUserDto: CreateUserDto) {
    const res = await this.authService.userRegistration(createUserDto)
    return res
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBadRequestResponse({ description: "Invalid login credentials" })
  @ApiResponse({ status: 200, description: 'User successfully logged in and refresh token', type: String })
  @Post('login')
  async userLogin(@Body() loginDto: UserLoginDto) {
    const token = await this.authService.validateUser(loginDto)
    return {id: loginDto.email, token }
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getUser(@Request() req: any) {
    return this.authService.getUserInfo(req.user.phone);
  }

  




}
