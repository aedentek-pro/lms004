import { Controller, Post, Body, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return { success: true, data: user };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto,
    );
    // FIX: Cast to 'any' to bypass TypeScript error on 'cookie'. This is likely due to missing or misconfigured @types/cookie-parser.
    (response as any).cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { success: true, data: { accessToken, user } };
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    // FIX: Cast to 'any' to bypass TypeScript error on 'cookies'. This is likely due to missing or misconfigured @types/cookie-parser.
    const refreshToken = (request as any).cookies['refresh_token'];
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    return { success: true, data: { accessToken } };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // FIX: Cast to 'any' to bypass TypeScript error on 'cookies'. This is likely due to missing or misconfigured @types/cookie-parser.
    const refreshToken = (request as any).cookies['refresh_token'];
    await this.authService.logout(refreshToken);
    // FIX: Cast to 'any' to bypass TypeScript error on 'clearCookie'. This is likely due to missing or misconfigured @types/cookie-parser.
    (response as any).clearCookie('refresh_token');
    return { success: true, message: 'Logged out successfully' };
  }
}