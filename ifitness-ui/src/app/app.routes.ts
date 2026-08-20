import { Routes } from '@angular/router';
import { ActivitiesListComponent } from './activities/activities-list/activities-list.component';
import { LoginFormComponent } from './security/login-form/login-form.component';
import { ActivityRegisterComponent } from './activities/activity-register/activity-register.component';

export const routes: Routes = [
  { path: 'activities', component: ActivitiesListComponent },
  { path: 'activities/new', component: ActivityRegisterComponent },
  { path: 'login', component: LoginFormComponent }

];