import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Hospital } from 'src/app/common/hospital';
import { Ward } from 'src/app/common/ward';
import { HospitalService } from 'src/app/service/hospital.service';
import { WardService } from 'src/app/service/ward.service';

@Component({
  selector: 'app-hospital-details',
  standalone: true,
  imports: [],
  templateUrl: './hospital-details.component.html',
  styleUrl: './hospital-details.component.scss'
})
export class HospitalDetailsComponent {

  hospitalService = inject(HospitalService);
  wardService = inject(WardService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;

  hospital: Hospital = null;
  wards: Ward[] = [];

  ngOnInit() {
    const hospitalId = +this.route.snapshot.paramMap.get('id')!;
    this.hospitalService.getHospitalById(hospitalId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.toastr.error(`Szpital z id: ${hospitalId} nie istnieje!`);
          this.router.navigate(['hospitals']);
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.hospital = data;
      
      this.wardService.getWardsByHospitalId(hospitalId).subscribe((data) => {
        this.wards = data;
        this.isResponseHere = true;
      });
    });
  }

  findArrayIndex(id: number) {
    return this.wards.findIndex(ward => ward.id === id);
  }

  redirectToHospitals() {
    this.router.navigate(['hospitals']);
  }

  redirectToAddWard() {
    this.router.navigate([`hospitals/${this.hospital.id}/addWard`]);
  }

  redirectToWardDetails(wardId: number) {
    // TODO
  }
}
