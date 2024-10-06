import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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
}
