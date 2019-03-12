import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Term } from 'src/app/_models/term';

@Injectable()
export class TermService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllTerm(): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`${this.restHubApi}/terms`);
  }

  addTerm(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/terms`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateTerm(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/terms`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteTerm(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/terms?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

}
