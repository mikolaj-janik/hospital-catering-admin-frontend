import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Hospital } from '../common/hospital';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private routerService: Router,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  getAllHospitals(): Observable<Hospital[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/hospitals`;

    return this.http.get<GetResponseHospitals>(url, { headers }).pipe(map(
      response => response.content
    ));
  }
}

interface GetResponseHospitals {
  totalElements: number,
  totalPages: number,
  size: number,
  content: Hospital[],
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  numberOfElements: number,
  first: boolean,
  last: boolean,
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    paged: boolean,
    unpaged: boolean
  },
  empty: boolean
}