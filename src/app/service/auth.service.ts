import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable(
  {providedIn: 'root'})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';

  private hasErrors = false;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.isAuthenticatedSubject.asObservable();

  private routerService = inject(Router);
  private http = inject(HttpClient);

  constructor() { }

  login(user: {email: string, password: string}): Observable<any> {
    return this.http
    .post(`${environment.apiUrl}/login`, user)
    .pipe(
      tap((token: {token: string}) => this.doLoginUser(user.email, token.token)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.hasErrors = true;
          const errorMessage = error.error.message;
          console.log(errorMessage);
          return throwError(() => new Error(errorMessage));
        }
      })
    );
  }

  isError() : boolean {
    return this.hasErrors;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.routerService.navigate(['/login']);
  }

  private doLoginUser(email: string, token: string) {
    this.isAuthenticatedSubject.next(true);
    this.hasErrors = false;
    this.storeJwtToken(token);
    this.storeUserEmail(email);
  }

  private storeUserEmail(email: string) {
    localStorage.setItem(this.USER_EMAIL, email);
  }
  
  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getJwtToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }
}
