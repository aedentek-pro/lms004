import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/courses')
@UseGuards(AuthGuard('jwt'))
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.Admin, Role.Instructor)
  @UseGuards(RolesGuard)
  create() {
    return this.coursesService.create();
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Instructor)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string) {
    return this.coursesService.update(id);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Instructor)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
