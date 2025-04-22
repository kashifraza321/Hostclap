import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { InsightBoardComponent } from './insight-board/insight-board.component';
// import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    InsightBoardComponent,
    // NgChartsModule,
  ],
})
export class DashboardModule {}
