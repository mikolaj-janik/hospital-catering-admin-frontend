import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Hospital } from '../common/hospital';
import { environment } from 'src/environments/environment';
import { SearchBarService } from './search-bar.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  searchTerm = this.searchBarService.searchTerm;

  getAllHospitals(): Observable<Hospital[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals`;

    return this.http.get<GetResponseHospitals>(url, { headers }).pipe(map(
      response => response.content
    ));
  }

  addNewHospital(formData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeadersWithFile();

    return this.http
    .post(`${environment.apiUrl}/hospitals/add`, formData, { headers })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
       if (error.status === 0) {
          this.authService.handleServerConnectionError();
        } else {
          this.toastr.error('Wystąpił problem z dodawaniem szpitala');
        }
        errorMessage = error.error.message;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getHospitalsByName(searchTerm: string): Observable<Hospital[]> {
    const url = `${environment.apiUrl}/hospitals/search?name=${searchTerm}`;
    const headers = this.authService.getAuthHeaders();
    return this.http.get<GetResponseHospitals>(url, { headers }).pipe(map(
      response => response.content
    ));
  }
}

interface GetResponseHospitals {
  totalElements: number,
  totalPages: number,
  size: number,
  content: Hospital[],
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  numberOfElements: number,
  first: boolean,
  last: boolean,
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    paged: boolean,
    unpaged: boolean
  },
  empty: boolean
}