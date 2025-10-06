import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

  @Get('me')
  getProfile(@Req() req) {
    return { success: true, data: req.user };
  }

  @Get('/admin/users')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  listUsers() {
    // In a real app, this would use the UserService to fetch and paginate users
    return { success: true, message: "Admin user list endpoint placeholder" };
  }
}
