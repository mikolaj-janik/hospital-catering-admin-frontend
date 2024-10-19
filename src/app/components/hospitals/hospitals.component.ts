import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Hospital } from 'src/app/common/hospital';
import { AuthService } from 'src/app/service/auth.service';
import { HospitalService } from 'src/app/service/hospital.service';
import { SearchBarService } from 'src/app/service/search-bar.service';

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
  route = inject(ActivatedRoute);

  isLoggedIn! : boolean;
  hospitals: Hospital[] = [];
  searchMode: boolean = false;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    
    this.route.paramMap.subscribe(() => {
      this.listHospitals();
    });
    
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  listHospitals() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    
    if (!this.searchMode) {
      this.handleListHospitals();
    }
    else {
      this.handleSearchHospitals();
    }
  }

  handleSearchHospitals() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.hospitalService.getHospitalsByName(keyword).subscribe(this.processResult());
  }

  handleListHospitals() {
    this.hospitalService.getAllHospitals().subscribe(this.processResult());
  }

  processResult() {
    return (hospitals: any) => {
      this.hospitals = hospitals;
    }
  }
}


