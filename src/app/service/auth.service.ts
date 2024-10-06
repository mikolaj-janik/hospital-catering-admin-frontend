import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable(
  {providedIn: 'root'})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.isAuthenticatedSubject.asObservable();

  private errorStatusCode = new BehaviorSubject<number>(-1);
  public errorStatusCode$ = this.errorStatusCode.asObservable();

  constructor(
    private routerService: Router,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  login(user: {email: string, password: string}): Observable<any> {
    return this.http
    .post(`${environment.apiUrl}/login`, user)
    .pipe(
      tap((token: {token: string}) => this.doLoginUser(user.email, token.token)),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.status === 401) {
          errorMessage = error.error.message;
          this.errorStatusCode.next(401);
          this.toastr.error('Niepoprawny adres e-mail lub hasło');
        } 
        else if (error.status === 0) {
          errorMessage = error.error.message;
          this.errorStatusCode.next(0);
        }
        console.log(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);

    if (!token) {
      return false;
    }

    const tokenPayload = this.decodeToken(token);

    if (!tokenPayload) {
      return false;
    }

    const expirationDate = tokenPayload.exp * 1000;
    const currentDate = new Date().getTime();

    if (expirationDate < currentDate) {
      this.toastr.warning('Sesja wygasła');
      return false;
    }

    return true;
  }

  decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch(e) {
      console.error('Error decoding token ', e);
      return null;
    }
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_EMAIL);
    this.isAuthenticatedSubject.next(false);
    this.routerService.navigate(['/login']);
  }

  private doLoginUser(email: string, token: string) {
    this.isAuthenticatedSubject.next(true);
    this.errorStatusCode.next(200);
    this.storeJwtToken(token);
    this.storeUserEmail(email);
    this.toastr.success("Pomyślnie zalogowano jako " + email);
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
