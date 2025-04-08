import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/commonComponent/dashboard/dashboard.component';
import { InsightBoardComponent } from './insight-board/insight-board.component';
import { MyHubComponent } from './insight-board/components/my-hub/my-hub.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: InsightBoardComponent },
  { path: 'myhub', component: MyHubComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
