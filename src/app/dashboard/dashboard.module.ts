import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';

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

import { JwtInterceptor, ErrorInterceptor } from '../_helpers';
import { StudentService } from './student/student.service';
import { DashboardService } from './dashboard.service';
import { TeacherComponent } from './teacher/teacher.component';
import { CourseComponent } from './course/course.component';
import { MarkComponent } from './mark/mark.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ClassComponent } from './class/class.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StudentComponent,
    TeacherComponent,
    CourseComponent,
    MarkComponent,
    ScheduleComponent,
    ClassComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    DashboardRoutingModule,
    BrowserAnimationsModule,
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
    StudentService,
    DashboardService
  ],
  bootstrap: []
})
export class DashboardModule { }
