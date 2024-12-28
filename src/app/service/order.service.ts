import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from '../common/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getOrders(pageNumber: number, pageSize: number): Observable<GetResponseOrders> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/orders?page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetResponseOrders>(url, { headers });
  }
}

interface GetResponseOrders {
  totalElements: number,
  totalPages: number,
  size: number,
  content: Order[],
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
