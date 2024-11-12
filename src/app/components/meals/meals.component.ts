import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MealService } from 'src/app/service/meal.service';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Meal } from 'src/app/common/meal';
import { DietService } from 'src/app/service/diet.service';


interface Diet {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, RouterModule, MatPaginator, MatSelectModule],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss'
})
export class MealsComponent {

  dialogRef = inject(MatDialog);
  mealService = inject(MealService);
  dietService = inject(DietService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isLoggedIn!: boolean;
  meals: Meal[] = [];
  diets: Diet[] = [];
  types = ['wszystkie', 'śniadanie', 'obiad', 'kolacja'];
  searchMode: boolean = false;

  selectedType = 'wszystkie';
  selectedDiet = 0;

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
    
    this.dietService.getAllDietsWithActiveMeals().subscribe((diets: Diet[]) => {
      this.diets = diets;
    });
    
    if (!this.isLoggedIn) {
      this.authService.logout(); 
    }
  }

  onTypeSelected(selectedType: string) {
    this.selectedType = selectedType;
    this.handleListMeals();
  }

  onDietSelected(selectedDiet: number) {
    this.selectedDiet = selectedDiet;
    this.handleListMeals();
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
    console.log(this.selectedDiet);
    
    return this.mealService.getMealsByName(this.pageNumber, this.pageSize, keyword).subscribe(this.processResult());
  }

  handleListMeals() {
    this.mealService.getAllMeals(this.selectedDiet, this.selectedType, this.pageNumber, this.pageSize).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.meals = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
    }
  }

  redirectToDetails(id: number) {
    this.router.navigate([`meals/details/${id}`]);
  }
}
