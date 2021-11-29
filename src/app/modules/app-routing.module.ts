import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from '../components/signup/signup.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full', canActivate:[AuthGuard], data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) }},
  {path: 'login', component: LoginComponent, canActivate:[AuthGuard], data: { authGuardPipe: () => redirectLoggedInTo(['']) }},
  {path: 'signup', component: SignupComponent, canActivate:[AuthGuard], data: { authGuardPipe: () => redirectLoggedInTo(['']) }},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard], data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
