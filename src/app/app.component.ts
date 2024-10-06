import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
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
}
