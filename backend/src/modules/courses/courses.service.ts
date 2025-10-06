import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create() {
    return 'This action adds a new course';
  }

  async findAll() {
    return {
        success: true,
        data: await this.prisma.course.findMany({
            include: {
                instructor: {
                    select: { name: true }
                },
                modules: true,
            }
        })
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} course`;
  }

  update(id: string) {
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
