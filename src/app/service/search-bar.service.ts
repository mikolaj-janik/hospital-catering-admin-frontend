import { Injectable, signal } from '@angular/core';
import { Hospital } from '../common/hospital';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HospitalService } from './hospital.service';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  overlayOpen = signal(false);
  recentSearches = signal<string[]>([]);
  searchTerm = signal('');

  routePath = '';

  private readonly recentHospitalSearches = 'recentHospitalSearches';
  private readonly recentDietSearches = 'recentDietSearches';

  constructor(
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

  searchHospital(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addHospitalNameToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`hospitals/search/${searchTerm}`]);
  }

  searchDiet(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addDietNameToRecentSearches(searchTerm);
    console.log(searchTerm);
    this.router.navigate([`meals/diets/search/${searchTerm}`]);
  }

  getRecentHospitalSearches() {
    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword') {
      let searches = localStorage.getItem(this.recentHospitalSearches);

      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      } 
    }
  }

  getRecentDietsSearches() {
    if (this.routePath === 'meals/diets' || this.routePath === 'meals/diets/:keyword') {
      let searches = localStorage.getItem(this.recentDietSearches);

      if (searches) {
        this.recentSearches.set(JSON.parse(searches));
      }
    }
  } // TODO similar methods with meals, users etc

  deleteRecentSearch(searchTerm: string) {
    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword') {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentHospitalSearches, JSON.stringify(updatedSearches));

    } else if (this.routePath === 'meals/diets' || this.routePath === 'meals/diets/search/:keyword') {
      const updatedSearches = this.handleDeleteSearch(searchTerm);
      localStorage.setItem(this.recentDietSearches, JSON.stringify(updatedSearches));
    }
  }

  addHospitalNameToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);

    localStorage.setItem(this.recentHospitalSearches, JSON.stringify(updatedSearches));
  }

  addDietNameToRecentSearches(searchTerm: string) {
    const updatedSearches = this.handleAddNameToRecentSearches(searchTerm);

    localStorage.setItem(this.recentDietSearches, JSON.stringify(updatedSearches));
  }
  
  private handleAddNameToRecentSearches(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const updatedSearches = [
      lowerCaseTerm,
      ...this.recentSearches().filter(s => s !== lowerCaseTerm),
    ];

    this.recentSearches.set(updatedSearches);
    return updatedSearches;
  }

  private handleDeleteSearch(searchTerm: string) {
    const updatedSearches = this.recentSearches().filter(s => s !== searchTerm);

      if (updatedSearches.length === 0) {
        this.overlayOpen.set(false);
      }
      
      this.recentSearches.set(updatedSearches);

      return updatedSearches;
  }
}
