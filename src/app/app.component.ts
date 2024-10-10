import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  
  isLoggedIn! : boolean;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );

    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  logout() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.toastr.info('Wylogowano pomyślnie');
    }
  }
}