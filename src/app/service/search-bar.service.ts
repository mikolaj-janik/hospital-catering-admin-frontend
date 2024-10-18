import { Injectable, signal } from '@angular/core';
import { Hospital } from '../common/hospital';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  overlayOpen = signal(false);
  recentSearches = signal<string[]>([]);
  searchTerm = signal('');

  routePath = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this.activatedRoute.root;
        while(currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        this.routePath = currentRoute.snapshot.routeConfig?.path;
      });
  }


  searchHospital(searchTerm: string): Observable<Hospital[]> {
    const url = `${environment.apiUrl}/search?name=${searchTerm}`;
    const headers = this.authService.getAuthHeaders();

    
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addHospitalNameToRecentSearches(searchTerm);

    return this.http.get<GetResponseHospitals>(url, { headers }).pipe(map(
      response => response.content
    ));
  }

  getRecentHospitalSearches() {
    if (this.routePath === '' || this.routePath === 'hospitals') {
      let searches = localStorage.getItem("recentHospitalSearches");
      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      } 
    } //TODO handling dieticians, meals etc.
  }

  deleteRecentSearch(searchTerm: string) {
    if (this.routePath === '' || this.routePath === 'hospitals') {
      const updatedSearches = this.recentSearches().filter(s => s !== searchTerm);

      if (updatedSearches.length === 0) {
        this.overlayOpen.set(false);
      }
      
      this.recentSearches.set(updatedSearches);
      localStorage.setItem('recentHospitalSearches', JSON.stringify(updatedSearches));
    } //TODO
  }
  addHospitalNameToRecentSearches(searchTerm: string) {

    const lowerCaseTerm = searchTerm.toLowerCase();
    const updatedSearches = [
      lowerCaseTerm,
      ...this.recentSearches().filter(s => s !== lowerCaseTerm),
    ];

    this.recentSearches.set(updatedSearches);

    localStorage.setItem('recentHospitalSearches', JSON.stringify(updatedSearches));
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