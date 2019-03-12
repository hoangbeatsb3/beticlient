import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mark } from 'src/app/_models/mark';
import { Term } from "../../_models/term";

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

  deleteMark(studentId: number, courseId: number, termId: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/marks/student/${studentId}/course/${courseId}/term/${termId}`,
           { headers: httpHeaders, observe: 'response' });
  }

  getMarkByStudentId(studentId: number): Observable<Mark[]> {
    return this.httpClient.get<Mark[]>(`${this.restHubApi}/marks/student/${studentId}`);
  }

  getAllTerm(): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.restHubApi}/terms`);
  }

}
