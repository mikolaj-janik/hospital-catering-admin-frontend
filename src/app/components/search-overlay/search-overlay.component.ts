import { Component, computed } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { inject } from '@angular/core';
import { SearchBarService } from 'src/app/service/search-bar.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [MatDivider, MatListModule, MatIcon, MatIconButton],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent {
  searchBarService = inject(SearchBarService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  recentSearches = computed(() => this.searchBarService.recentSearches().slice(0, 5));

  routePath = '';

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

  deleteRecentSearch(searchTerm: string) {
    this.searchBarService.deleteRecentSearch(searchTerm);
  }

  performSearch(searchTerm: string) {
    if (this.routePath === '' || this.routePath === 'hospitals') {
      this.searchBarService.searchHospital(searchTerm);
    } // TODO
  }
}
