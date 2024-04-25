import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private authTokenKey = 'Token';
  private refreshTokenKey = 'RefreshToken';

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn.next(this.isAuthenticated());
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/login', { username, password })
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem(this.authTokenKey, response.token);
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
          this.loggedIn.next(true);
        })
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<any>('http://localhost:3000/api/auth/refresh-token', { refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.authTokenKey, response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.loggedIn.next(false);
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private isAuthenticated(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }
}
