import { Routes } from '@angular/router';
import { ActivitiesListComponent } from './activities/activities-list/activities-list.component';
import { LoginFormComponent } from './security/login-form/login-form.component';
import { ActivityRegisterComponent } from './activities/activity-register/activity-register.component';
import { UserRegisterComponent } from './users/user-register/user-register.component';
import { PageNotFoundComponent } from './core/page-not-found.component';
import { authGuard } from './security/auth.guard';
import { NotAuthorizedComponent } from './core/not-authorized.component';

export const routes: Routes = [
  { path: '', redirectTo: 'activities', pathMatch: 'full' },
  {
    path: 'activities/:id',
    component: ActivityRegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_REGISTER_ACTIVITY'] }
  },
  {
    path: 'activities',
    component: ActivitiesListComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_SEARCH_ACTIVITY'] }
  },
  {
    path: 'activities/new',
    component: ActivityRegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_REGISTER_ACTIVITY'] }
  },
  { path: 'users/new', component: UserRegisterComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found'} // importante que seja a última rota
];