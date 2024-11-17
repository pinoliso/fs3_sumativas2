import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/users';
  private localStorageKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    const user = localStorage.getItem(this.localStorageKey);
    return !!user;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users: User[]) => {
          const user = users.length > 0 ? users[0] : undefined;
          if (user) {
            localStorage.setItem(this.localStorageKey, user.id!.toString());
          }
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/login']);
  }
}

