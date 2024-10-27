import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// MDB Modules
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, authGuardLogin } from './service/auth.guard.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomSidenavComponent } from "./components/custom-sidenav/custom-sidenav.component";
import { HospitalsComponent } from './components/hospitals/hospitals.component';
import { DieticiansComponent } from './components/dieticians/dieticians.component';
import { MealsComponent } from './components/meals/meals.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchOverlayComponent } from './components/search-overlay/search-overlay.component';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { NewHospitalComponent } from './components/new-hospital/new-hospital.component';
import { DietComponent } from './components/diet/diet.component';
import { NewDietComponent } from './components/new-diet/new-diet.component';
import { DietDetailsComponent } from './components/diet-details/diet-details.component';
import { EditDietComponent } from './components/edit-diet/edit-diet.component';


const routes: Routes = [
  {path: 'hospitals', component: HospitalsComponent, canActivate: [authGuard]},
  {path: 'hospitals/search/:keyword', component: HospitalsComponent, canActivate: [authGuard]},
  {path: 'hospitals/add', component: NewHospitalComponent, canActivate: [authGuard]},
  {path: 'dieticians', component: DieticiansComponent, canActivate: [authGuard]},
  {path: 'meals', component: MealsComponent, canActivate: [authGuard]},
  {path: 'meals/diets', component: DietComponent, canActivate: [authGuard]},
  {path: 'meals/diets/search/:keyword', component: DietComponent, canActivate: [authGuard]},
  {path: 'meals/diets/:id', component: DietDetailsComponent, canActivate: [authGuard]},
  {path: 'meals/diets/edit/:id', component: EditDietComponent, canActivate: [authGuard]},
  {path: 'meals/addDiet', component: NewDietComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent, canActivate: [authGuardLogin]},
  {path: 'logout', component: LoginComponent, canActivate: [authGuardLogin]},
  {path: '', redirectTo: '/hospitals', pathMatch: 'full'},
  {path: '**', redirectTo: '/hospitals', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
    CustomSidenavComponent,
    SearchBarComponent,
    SearchOverlayComponent,
    OverlayModule
],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic'}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
