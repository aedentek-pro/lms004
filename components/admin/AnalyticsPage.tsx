import React from 'react';
import { User, Course, StudentProgress, UserRole } from '../../types';
import { Card } from '../shared/Card';
import { StarIcon } from '../icons/Icons';

interface SimpleBarChartProps {
    title: string;
    data: {
        label: string;
        value: number;
        displayValue?: string;
    }[];
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
      <div className="space-y-4 min-h-[10rem]">
        {data.length > 0 ? data.map(item => (
          <div key={item.label}>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-slate-600 truncate pr-2">{item.label}</span>
              <span className="font-semibold text-slate-800">{item.displayValue || item.value}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        )) : <p className="text-slate-500 text-center pt-8">No data available for this chart.</p>}
      </div>
    </Card>
  );
};


interface AnalyticsPageProps {
    users: User[];
    courses: Course[];
    studentProgress: StudentProgress[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ users, courses, studentProgress }) => {
  // Calculate metrics
  const totalStudents = users.filter(u => u.role === UserRole.Student).length;
  const totalInstructors = users.filter(u => u.role === UserRole.Instructor).length;
  const totalAdmins = users.filter(u => u.role === UserRole.Admin).length;

  const enrollmentsByCourse = courses.map(course => {
    const enrollments = studentProgress.filter(p => p.courseId === course.id).length;
    return { ...course, enrollments };
  });

  const totalRevenue = enrollmentsByCourse
    .reduce((acc, course) => acc + (course.price || 0) * course.enrollments, 0);

  const ratedCourses = courses.filter(c => c.rating && c.totalRatings && c.totalRatings > 0);
  const averageRating = ratedCourses.length > 0
    ? ratedCourses.reduce((acc, course) => acc + (course.rating || 0), 0) / ratedCourses.length
    : 0;

  // Prepare data for charts
  const userRoleData = [
    { label: 'Students', value: totalStudents },
    { label: 'Instructors', value: totalInstructors },
    { label: 'Admins', value: totalAdmins },
  ];

  const coursePopularityData = enrollmentsByCourse
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5) // Show top 5
    .map(course => ({ label: course.title, value: course.enrollments, displayValue: `${course.enrollments} students` }));
    
  const revenueByCourseData = enrollmentsByCourse
    .filter(c => c.price && c.price > 0 && c.enrollments > 0)
    .map(course => ({
      label: course.title,
      value: (course.price || 0) * course.enrollments,
      displayValue: `$${((course.price || 0) * course.enrollments).toFixed(2)}`
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Show top 5
    
  const coursesByInstructorData = users
    .filter(u => u.role === UserRole.Instructor)
    .map(instructor => {
        const courseCount = courses.filter(course => course.instructorId === instructor.id).length;
        return {
            label: instructor.name,
            value: courseCount,
            displayValue: `${courseCount} course${courseCount !== 1 ? 's' : ''}`
        };
    })
    .filter(data => data.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 instructors

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Platform Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-700">Total Revenue</h3>
          <p className="text-3xl font-bold text-violet-600">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-700">Total Students</h3>
          <p className="text-3xl font-bold text-violet-600">{totalStudents}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-700">Active Courses</h3>
          <p className="text-3xl font-bold text-violet-600">{courses.length}</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-700">Average Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-violet-600 mr-2">{averageRating.toFixed(1)}</p>
            <StarIcon className="w-7 h-7 text-yellow-400" fill="currentColor"/>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimpleBarChart title="Top 5 Courses by Enrollment" data={coursePopularityData} />
        <SimpleBarChart title="Top 5 Courses by Revenue" data={revenueByCourseData} />
        <SimpleBarChart title="User Role Distribution" data={userRoleData} />
        <SimpleBarChart title="Top Instructors by Courses Created" data={coursesByInstructorData} />
      </div>
    </div>
  );
};
