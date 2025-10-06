import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('api/assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  @Post(':assignmentId/submissions')
  @Roles(Role.Student)
  @UseGuards(RolesGuard)
  createSubmission(@Param('assignmentId') assignmentId: string) {
    return `This action adds a new submission for assignment #${assignmentId}`;
  }

  @Get(':assignmentId/submissions')
  @Roles(Role.Admin, Role.Instructor)
  @UseGuards(RolesGuard)
  findAllSubmissions(@Param('assignmentId') assignmentId: string) {
    return `This action returns all submissions for assignment #${assignmentId}`;
  }

  @Post(':assignmentId/submissions/:submissionId/grade')
  @Roles(Role.Admin, Role.Instructor)
  @UseGuards(RolesGuard)
  gradeSubmission(@Param('submissionId') submissionId: string) {
    return `This action grades submission #${submissionId}`;
  }
}
