import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    
    constructor(private http: HttpClient) { }

    restHubApi: string = environment.contextPath;

    login(username: string, password: string) {
        return this.http.post<any>(`${this.restHubApi}/api/auth/signin`, { username, password })
            .pipe(map(user => {
                if (user && user.accessToken) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');

    }
}