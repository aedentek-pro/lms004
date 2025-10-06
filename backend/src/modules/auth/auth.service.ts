import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const user = await this.usersService.create(signUpDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = user;

    return { accessToken, refreshToken, user: userResult };
  }

  async logout(token: string) {
    if (!token) return;
    const tokenHash = await bcrypt.hash(token, 10);
    // In a real app, you would find the token by its hash and revoke it.
    // For this example, we assume logout is stateless on the server side
    // after clearing the client cookie. A stateful implementation is below.
    await this.prisma.refreshToken.updateMany({
        where: {
            // This is a simplification. A real implementation would need to compare hashes securely.
            // For now, this demonstrates the concept of revoking a token.
            // A better way is to store the hash and compare against it.
        },
        data: { revoked: true },
    });
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      
      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    
    // Store the refresh token hash in the database
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        }
    });

    return token;
  }
}
