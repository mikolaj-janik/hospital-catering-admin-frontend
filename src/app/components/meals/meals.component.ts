import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MealService } from 'src/app/service/meal.service';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Meal } from 'src/app/common/meal';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginator],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  dialogRef = inject(MatDialog);
  mealService = inject(MealService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  isLoggedIn!: boolean;
  meals: Meal[] = [];
  searchMode: boolean = false;

  pageNumber = 0;
  pageSize = 10;
  totalElements = 0;
  
  openDialog(image: string) {
    this.dialogRef.open(PopUpComponent, { data : image });
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    this.route.paramMap.subscribe(() => {
      this.listMeals();
    });
    
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.listMeals();
  }

  listMeals() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (!this.searchMode) {
      this.handleListMeals();
    }
    else {
      this.handleSearchMeals();
    }
  }

  handleSearchMeals() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
    
    return this.mealService.getMealsByName(this.pageNumber, this.pageSize, keyword).subscribe(this.processResult());
  }

  handleListMeals() {
    this.mealService.getAllMeals(this.pageNumber, this.pageSize).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.meals = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
    }
  }

  redirectToEdit() {
    console.log('TODO');
  }
}
