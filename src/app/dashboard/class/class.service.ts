import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Class } from 'src/app/_models/class';

@Injectable()
export class ClassService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllClass(): Observable<Class[]> {
    return this.httpClient.get<Class[]>(`${this.restHubApi}/classes`);
  }

  addClass(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/classes`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateClass(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/classes`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteClass(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/classes?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

  getCountById(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.restHubApi}/student-schedule/class/${id}`);
  }

}
