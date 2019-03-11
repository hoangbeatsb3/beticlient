import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from 'src/app/_models/course';


@Injectable()
export class CourseService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllCourse(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.restHubApi}/courses`);
  }

  addCourse(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/courses`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateCourse(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/courses`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteCourse(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/courses?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

}
