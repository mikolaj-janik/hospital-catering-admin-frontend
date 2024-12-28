import { Component, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatPaginator],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  orderService = inject(OrderService);

  orders: Order[] = [];
  paginaror: MatPaginator;

  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  isResponseHere = false;

  ngOnInit() {
    this.listOrders();
  }

  listOrders() {
    this.isResponseHere = false;
    this.orderService.getOrders(this.pageNumber, this.pageSize).subscribe(
      data => {
        this.orders = data.content;
        this.totalElements = data.totalElements;
        this.isResponseHere = true;
      }
    );  
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.listOrders();
  }

  formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);
  
    if (diffInMinutes < 1) {
      return 'Przed chwilą';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min temu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} godzin temu`;
    } else {
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
  
      const currentYear = now.getFullYear();
      if (year === currentYear) {
        return `${day} ${this.getMonthName(date.getMonth())} godz. ${hours}:${minutes}`;
      } else {
        return `${day} ${this.getMonthName(date.getMonth())} ${year} godz. ${hours}:${minutes}`;
      }
    }
  }

  formatOrderItemDate(dateString: string) {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  getMonthName(monthIndex: number): string {
    const months = [
      'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
      'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    return months[monthIndex];
  }
}
