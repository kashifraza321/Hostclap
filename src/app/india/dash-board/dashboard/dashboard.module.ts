import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { InsightBoardComponent } from './insight-board/insight-board.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, DashboardRoutingModule, InsightBoardComponent],
})
export class DashboardModule {}
