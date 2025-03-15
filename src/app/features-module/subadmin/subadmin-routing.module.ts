import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubadminManagementListComponent } from './Components/subadmin-management-list/subadmin-management-list.component';

const routes: Routes = [
  {
    path: '',
    component: SubadminManagementListComponent,
  },
  {
    path: 'subadmin',
    component: SubadminManagementListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubadminRoutingModule { }
