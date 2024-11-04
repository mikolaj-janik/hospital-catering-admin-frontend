import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from 'src/app/common/meal';
import { MealService } from 'src/app/service/meal.service';
import { PopUpComponent } from '../pop-up/pop-up.component';

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss'
})
export class MealDetailsComponent {
  meal: Meal = null;

  dialogRef = inject(MatDialog);
  mealService = inject(MealService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleMealDetails();
    });
  }

  handleMealDetails() {
    const mealId: number = +this.route.snapshot.paramMap.get('id')!;

    this.mealService.getMealById(mealId).subscribe(
      data => {
        this.meal = data;
      }
    );
  }

  redirectToMeals() {
    this.router.navigate(['meals']);
  }

  redirectToEdit(id: number) {
    this.router.navigate([`meals/edit/${id}`]);
  }

  openDialog(image: string) {
    this.dialogRef.open(PopUpComponent, { data : image });
  }
}
