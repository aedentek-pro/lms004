import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const userCounts = await this.prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    const totalCourses = await this.prisma.course.count();
    const totalEnrollments = await this.prisma.enrollment.count();
    
    // Simplified revenue calculation
    const coursesWithPrice = await this.prisma.course.findMany({
        where: { price: { gt: 0 }},
        include: { _count: { select: { enrollments: true }}}
    });
    const revenue = coursesWithPrice.reduce((acc, course) => acc + course.price * course._count.enrollments, 0);

    return {
      success: true,
      data: {
        users: {
          total: await this.prisma.user.count(),
          students: userCounts.find(c => c.role === Role.Student)?._count.id || 0,
          instructors: userCounts.find(c => c.role === Role.Instructor)?._count.id || 0,
          admins: userCounts.find(c => c.role === Role.Admin)?._count.id || 0,
        },
        activeCourses: totalCourses,
        enrollments: totalEnrollments,
        revenueEstimate: revenue,
      },
    };
  }
}
