import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Diet } from 'src/app/common/diet';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-diet-details',
  standalone: true,
  imports: [],
  templateUrl: './diet-details.component.html',
  styleUrl: './diet-details.component.scss'
})
export class DietDetailsComponent {
  diet: Diet = null;

  dietService = inject(DietService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleDietDetails();
    });
  }

  handleDietDetails() {
    const dietId: number = +this.route.snapshot.paramMap.get('id')!;

    this.dietService.getDietById(dietId).subscribe(
      data => {
        this.diet = data;
      }
    );
  }

  redirectToDiets() {
    this.router.navigate(['meals/diets']);
  }

  redirectToEdit(id: number) {
    this.router.navigate([`meals/diets/edit/${id}`]);
  }
}
