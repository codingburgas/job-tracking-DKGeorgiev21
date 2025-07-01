import { Routes } from '@angular/router';

import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { AdminJobsComponent } from './components/admin/admin-jobs/admin-jobs.component';
import { AdminApplicationsComponent } from './components/admin/admin-applications/admin-applications.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'my-applications', 
    component: MyApplicationsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin/jobs', 
    component: AdminJobsComponent, 
    canActivate: [AdminGuard] 
  },
  { 
    path: 'admin/applications', 
    component: AdminApplicationsComponent, 
    canActivate: [AdminGuard] 
  },
  { path: '**', redirectTo: '/jobs' }
];