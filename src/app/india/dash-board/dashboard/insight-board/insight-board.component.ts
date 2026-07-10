import { Component } from '@angular/core';
import { InsightHeaderComponent } from './components/insight-header/insight-header.component';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingRequestDetalModalComponent } from './components/booking-request-detal-modal/booking-request-detal-modal.component';

@Component({
  selector: 'app-insight-board',
  standalone: true,
  imports: [InsightHeaderComponent, RouterModule, MatDialogModule],
  templateUrl: './insight-board.component.html',
  styleUrl: './insight-board.component.css',
})
export class InsightBoardComponent {
  constructor(private dialog: MatDialog) {}
  activeTab: string = 'bookingRequests';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openBookingRequestModal() {
    const dialogRef = this.dialog.open(BookingRequestDetalModalComponent, {
      width: '400px',
      height: '400px',
      position: { top: '0', left: '300px' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
    });
  }
}
