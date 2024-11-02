import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SearchBarService } from './search-bar.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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

  getAllMeals(pageNumber: number, pageSize: number): Observable<GetResponseMeals> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/meals?page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetResponseMeals>(url, { headers });
  }
  getMealsByName(pageNumber: number, pageSize: number, searchTerm: string): Observable<GetResponseMeals> {
    const url = `${environment.apiUrl}/meals/search?name=${searchTerm}&page=${pageNumber}&size=${pageSize}`;
    const headers = this.authService.getAuthHeaders();
    return this.http.get<GetResponseMeals>(url, { headers });
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