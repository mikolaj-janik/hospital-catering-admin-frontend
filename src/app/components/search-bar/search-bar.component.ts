import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { MatIconButton } from '@angular/material/button';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SearchBarService } from 'src/app/service/search-bar.service';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatIconButton, OverlayModule, SearchOverlayComponent, CdkOverlayOrigin],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchBarComponent {
  
  router = inject(Router);
  searchBarService = inject(SearchBarService)
  activatedRoute = inject(ActivatedRoute);

  overlayOpen = this.searchBarService.overlayOpen;
  recentSearches = computed(() => this.searchBarService.recentSearches().slice(0, 5));
  searchTerm = this.searchBarService.searchTerm;

  routePath = '';
  paddingEnd = computed(() => this.searchTerm() ? '8px' : '56px');

  ngOnInit() {
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

  search(searchTerm: string) {
    if (!searchTerm) 
      return;

    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword') {
      this.searchBarService.searchHospital(searchTerm);

    } else if (this.routePath === 'meals/diets' || this.routePath === 'meals/diets/search/:keyword') {
      this.searchBarService.searchDiet(searchTerm);

    }
    
  }

  handleClickedInput() {
    const searches = this.recentSearches()
    if (searches.length > 0) {
      this.overlayOpen.set(true);
    } else {
      this.overlayOpen.set(false);
    }
    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword') {
      this.searchBarService.getRecentHospitalSearches();

    } else if (this.routePath === 'meals/diets' || this.routePath === 'meals/diets/search/:keyword') {
      this.searchBarService.getRecentDietsSearches();

    }
  }

  handleSearchContent() {
    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword') {
      return 'Szukaj szpitali';
    } else if (this.routePath === 'meals/diets' || this.routePath === 'meals/diets/search/:keyword') {
      return 'Szukaj diet';
    } else if (this.routePath === 'dieticians') {
      return 'Szukaj dietetyków';
    } else if (this.routePath === 'meals') {
      return 'Szukaj posiłków';
    } else {
      return '';
    }
  }
  
  clearSearch() {
    this.searchTerm.set('');
    if (this.recentSearches().length > 0) {
      this.overlayOpen.set(true);
    }
    
  }
}
