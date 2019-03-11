import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mark } from 'src/app/_models/mark';

@Injectable()
export class MarkService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllMark(): Observable<Mark[]> {
    return this.httpClient.get<Mark[]>(`${this.restHubApi}/marks`);
  }

  addMark(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/marks`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateMark(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/marks`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteMark(student_id: number, subject_id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/marks?student_id=${student_id}&subject_id=${subject_id}`,
           { headers: httpHeaders, observe: 'response' });
  }

  getMarkByStudentId(studentId: number): Observable<Mark[]> {
    return this.httpClient.get<Mark[]>(`${this.restHubApi}/marks/student/${studentId}`);
  }

}
