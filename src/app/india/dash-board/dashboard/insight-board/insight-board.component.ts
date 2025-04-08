import { Component } from '@angular/core';
import { InsightHeaderComponent } from './components/insight-header/insight-header.component';

@Component({
  selector: 'app-insight-board',
  standalone: true,
  imports: [InsightHeaderComponent],
  templateUrl: './insight-board.component.html',
  styleUrl: './insight-board.component.css',
})
export class InsightBoardComponent {
  activeTab: string = 'bookingRequests';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
