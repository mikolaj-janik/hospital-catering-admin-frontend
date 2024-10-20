import { Component, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  searchBarWidth = computed(() => this.collapsed() ? '5px': '200px');
  
  isLoggedIn! : boolean;
  
  routePath = '';

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this.activatedRoute.root;
        while(currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        this.routePath = currentRoute.snapshot.routeConfig?.path;
      });

    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  activateSearchBar() {
    if (this.routePath === '' || this.routePath === 'hospitals' || this.routePath === 'hospitals/search/:keyword'
    ||  this.routePath === 'dieticians'
    ) {
      return true;
    }
    return false;
  }
}