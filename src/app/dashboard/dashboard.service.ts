import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable()
export class DashboardService {

  restHubApi: string = "http://localhost:8099";
  userCurrent: any;

  constructor(private httpClient: HttpClient) { }

  getAllStudent(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.restHubApi}/students`);
  }

}
