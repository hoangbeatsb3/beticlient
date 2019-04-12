import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { AuthGuard } from '../_guards';
import { TeacherComponent } from './teacher/teacher.component';
import { CourseComponent } from './course/course.component';
import { MarkComponent } from './mark/mark.component';
import { ClassComponent } from './class/class.component';
import { TermComponent } from './term/term.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
      },
      {
        path: 'student',
        component: StudentComponent,
        data: {
          title: 'Student'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'teacher',
        component: TeacherComponent,
        data: {
          title: 'Teacher'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'course',
        component: CourseComponent,
        data: {
          title: 'Course'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'mark',
        component: MarkComponent,
        data: {
          title: 'Mark'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'class',
        component: ClassComponent,
        data: {
          title: 'Class'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'term',
        component: TermComponent,
        data: {
          title: 'Term'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User'
        },
        canActivate: [AuthGuard] 
      },
      {
        path: 'user/:user',
        component: UserComponent,
        data: {
          title: 'User'
        },
        canActivate: [AuthGuard] 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
