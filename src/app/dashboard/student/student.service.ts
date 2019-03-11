import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Student } from 'src/app/_models/student';
import { Mark } from 'src/app/_models/mark';

@Injectable()
export class StudentService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllStudent(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(`${this.restHubApi}/students`);
  }

  addStudent(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/students`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateStudent(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/students`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteStudent(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/students?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

  getDetailById(id: number): Observable<Mark[]> {
    return this.httpClient.get<Mark[]>(`${this.restHubApi}/marks/student_id/${id}`);
  }

}
