import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewManagementComponent } from './Components/review-management/review-management.component';
import { ReviewManagementProfileComponent } from './Components/review-management-profile/review-management-profile.component';
import { ReportedByComponent } from './Components/reported-by/reported-by.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewManagementComponent,
  },
  {
    path: 'review-profile',
    component: ReviewManagementProfileComponent,
  },
  {
    path: 'reported-by',
    component: ReportedByComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reviewManagementRoutingModule { }
