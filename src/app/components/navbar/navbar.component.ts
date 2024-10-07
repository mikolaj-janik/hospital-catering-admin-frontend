import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MdbDropdownDirective, MdbDropdownMenuDirective, MdbDropdownToggleDirective } from 'mdb-angular-ui-kit/dropdown';
import { animate, style, transition, trigger } from '@angular/animations';

const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({opacity: 1}))
])
const fadeIn = trigger('fadeIn', [enterTransition]);

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    fadeIn
  ]
})
export class NavbarComponent {
  dropdownOpen = false;
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  
  isLoggedIn! : boolean;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  logout() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.toastr.info('Wylogowano pomyślnie');
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
