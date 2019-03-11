import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Student } from '../_models/student';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    restHubApi: string = environment.contextPath;

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    getStudent() {
        return this.http.get<Student[]>(`${this.restHubApi}/student`);
    }
}