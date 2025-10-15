import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/commonComponent/dashboard/dashboard.component';
import { InsightBoardComponent } from './insight-board/insight-board.component';
import { MyHubComponent } from './insight-board/components/my-hub/my-hub.component';
import { AnalyticsComponent } from './insight-board/components/analytics/analytics.component';
import { ProFeaturesComponent } from './insight-board/components/pro-features/pro-features.component';
import { UpgradeComponent } from './insight-board/components/upgrade/upgrade.component';
import { ProfileComponent } from './insight-board/components/profile/profile.component';
import { EditorLayoutComponent } from './editor-layout/components/editor-layout/editor-layout.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'myhub', pathMatch: 'full' },
  { path: 'myhub', component: MyHubComponent },
  { path: 'customer', component: InsightBoardComponent },

  { path: 'analytics', component: AnalyticsComponent },
  { path: 'features', component: ProFeaturesComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'Profile', component: ProfileComponent },
  // { path: 'editor', component: EditorLayoutComponent },
  {
    path: 'editor',
    loadChildren: () =>
      import('../dashboard/editor-layout/editor-layout.module').then(
        (m) => m.EditorLayoutModule
      ),
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
