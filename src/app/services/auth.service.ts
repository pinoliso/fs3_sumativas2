import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/users';
  private localStorageKey = 'user';
  public user$ = signal<User | undefined | null>(undefined)

  constructor(private http: HttpClient, private router: Router) {
    this.getUser()
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem(this.localStorageKey);
    return !!user;
  }

  private loadUser(): void {
    const userJson = localStorage.getItem(this.localStorageKey);
    if (userJson) {
      this.user$.set(JSON.parse(userJson))
    }
  }

  getUser(): User | undefined {
    const user = localStorage.getItem(this.localStorageKey);
    if (user) {
      this.user$.set(JSON.parse(user))
    }
    return user ? JSON.parse(user) : undefined;
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
            this.user$.set(user)
            localStorage.setItem(this.localStorageKey, JSON.stringify(user));
          }
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.user$.set(null)
    this.router.navigate(['/login']);
  }
}

