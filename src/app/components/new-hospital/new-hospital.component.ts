import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-hospital',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './new-hospital.component.html',
  styleUrl: './new-hospital.component.scss'
})
export class NewHospitalComponent {

  name = '';
  phoneNumber = '';
  street = '';
  buildingNo = 0;
  zipCode = '';
  city = '';
  picture = '';  

  zipCodePattern = '[0-9]{2}-[0-9]{3}';

  newHospitalForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required]),
    phoneNumber: new FormControl(this.phoneNumber, [Validators.required, Validators.minLength(9)]),
    street: new FormControl(this.street, [Validators.required]),
    zipCode: new FormControl(this.zipCode, [Validators.required, Validators.pattern(this.zipCodePattern)]),
    buildingNo: new FormControl(this.buildingNo, [Validators.required]),
    city: new FormControl(this.city, [Validators.required]),
  });

  addNewHospital() {
    if (this.newHospitalForm.valid) {
      console.log('TODO');
    } else {
      console.log('Form not valid!');
    }
  }
}
