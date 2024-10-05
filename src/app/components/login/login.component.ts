import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';

import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoggedIn! : boolean;

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl(this.email, [Validators.required, Validators.email]),
    password: new FormControl(this.password, [Validators.required, Validators.minLength(6)])
  });

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    if (this.isLoggedIn) {
      this.router.navigate['/'];
    }
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login({
        email: email as string,
        password: password as string
      })
      .subscribe(() => {
        console.log('Successfully logged in!');
        this.router.navigate(['/']);
      })
    } else {
      console.log('Form is not valid! ');
    }
  }
}
