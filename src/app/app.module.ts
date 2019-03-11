import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

import { MatTableModule, MatPaginatorModule, MatNativeDateModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';

import { ConfirmStudentDialog } from './dashboard/student/student.component';
import { ConfirmTeacherDialog } from './dashboard/teacher/teacher.component';
import { ConfirmCourseDialog } from './dashboard/course/course.component';
import { ConfirmMarkDialog } from './dashboard/mark/mark.component';
import { ConfirmScheduleDialog } from './dashboard/schedule/schedule.component';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { UserService } from './_services/user.service';
import { TeacherService } from './dashboard/teacher/teacher.service';
import { CourseService } from './dashboard/course/course.service';
import { MarkService } from './dashboard/mark/mark.service';
import { ScheduleService } from './dashboard/schedule/shedule.service';
import { ClassService } from './dashboard/class/class.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmStudentDialog,
    ConfirmTeacherDialog,
    ConfirmCourseDialog,
    ConfirmMarkDialog,
    ConfirmScheduleDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule, 
    FormsModule, 
    MatSlideToggleModule, 
    MatAutocompleteModule, 
    MatExpansionModule,
    MatStepperModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatNativeDateModule, 
    MatCheckboxModule, 
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService,
    TeacherService,
    CourseService,
    MarkService,
    ScheduleService,
    ClassService
  ],
  entryComponents: [ConfirmStudentDialog, ConfirmTeacherDialog, 
                    ConfirmCourseDialog, ConfirmMarkDialog, ConfirmScheduleDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
