import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SearchBarService } from './search-bar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Meal } from '../common/meal';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) { }

  searchTerm = this.searchBarService.searchTerm;

  getAllMeals(dietId: number, type: string, pageNumber: number, pageSize: number): Observable<GetResponseMeals> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/meals?dietId=${dietId}&type=${type}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetResponseMeals>(url, { headers });
  }

  getMealsByName(pageNumber: number, pageSize: number, searchTerm: string): Observable<GetResponseMeals> {
    const url = `${environment.apiUrl}/meals/search?name=${searchTerm}&page=${pageNumber}&size=${pageSize}`;
    const headers = this.authService.getAuthHeaders();
    return this.http.get<GetResponseMeals>(url, { headers });
  }

  addNewMeal(formData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeadersWithFile();

    return this.http
    .post(`${environment.apiUrl}/meals/add`, formData, { headers })
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

  updateMeal(formData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeadersWithFile();

    return this.http
    .put(`${environment.apiUrl}/meals/update`, formData, { headers });
  }
}

interface GetResponseMeals {
  totalElements: number,
  totalPages: number,
  size: number,
  content: Meal[],
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