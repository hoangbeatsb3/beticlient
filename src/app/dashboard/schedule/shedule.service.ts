import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Schedule } from 'src/app/_models/schedule';

@Injectable()
export class ScheduleService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllSchedule(): Observable<Schedule[]> {
    return this.httpClient.get<Schedule[]>(`${this.restHubApi}/schedules`);
  }

  addSchedule(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/schedules`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateSchedule(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/schedules`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteSchedule(student_id: number, subject_id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/schedules?teacher_id=${student_id}&subject_id=${subject_id}`,
           { headers: httpHeaders, observe: 'response' });
  }

}
