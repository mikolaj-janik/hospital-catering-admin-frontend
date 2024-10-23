import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SearchBarService } from './search-bar.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Diet } from '../common/diet';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  constructor(
    private authService: AuthService,
    private searchBarService: SearchBarService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  searchTerm = this.searchBarService.searchTerm;

  getAllDiets(): Observable<Diet[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diets`;

    return this.http.get<Diet[]>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching diets', error);
        this.authService.handleError();
        return throwError(() => new Error('Failed to fetch diets'));
      })
    );
  }

  getDietByName(keyword: string): Observable<Diet[]> {
    // TODO
    return null;
  }

}
