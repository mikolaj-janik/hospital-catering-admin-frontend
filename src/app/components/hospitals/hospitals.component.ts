import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Hospital } from 'src/app/common/hospital';
import { AuthService } from 'src/app/service/auth.service';
import { HospitalService } from 'src/app/service/hospital.service';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.scss'
})
export class HospitalsComponent {

  hospitalService = inject(HospitalService);
  authService = inject(AuthService);

  isLoggedIn! : boolean;
  hospitals: Hospital[] = [];

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.hospitalService.getAllHospitals().subscribe(
      (hospitals: Hospital[]) => {
        this.hospitals = hospitals;
        console.log(hospitals.length);
      }
    );
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }
}


