import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/_models/User';

@Injectable()
export class UserService {

  restHubApi: string = environment.contextPath;
  constructor(private httpClient: HttpClient) { }

  getAllUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.restHubApi}/users`);
  }

  addUser(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.post<any>(`${this.restHubApi}/api/auth/signup`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  updateUser(body: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.put<any>(`${this.restHubApi}/users`, body,
           { headers: httpHeaders, observe: 'response' });
  }

  deleteUser(id: number): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete<any>(`${this.restHubApi}/users?id=${id}`,
           { headers: httpHeaders, observe: 'response' });
  }

}
