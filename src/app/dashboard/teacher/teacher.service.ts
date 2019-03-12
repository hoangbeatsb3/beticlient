import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeacherSchedule } from 'src/app/_models/teacherSchedule';


@Injectable()
export class TeacherService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllTeachers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.restHubApi}/teachers`);
  }

  getScheduleByTeacherId(id: number): Observable<TeacherSchedule[]> {
    return this.httpClient.get<TeacherSchedule[]>(`${this.restHubApi}/teacher-schedule/teacher/${id}`);
  }

  addTeacher(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.httpClient.post<any>(`${this.restHubApi}/teachers`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateTeacher(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.httpClient.put<any>(`${this.restHubApi}/teachers/update`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteTeacher(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.httpClient.delete<any>(`${this.restHubApi}/teachers?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

}
