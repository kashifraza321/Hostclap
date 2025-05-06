import { Component } from '@angular/core';
import { InsightHeaderComponent } from '../insight-header/insight-header.component';
import { RequestServiceModalComponent } from '../request-service-modal/request-service-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-hub',
  standalone: true,
  imports: [InsightHeaderComponent],
  templateUrl: './my-hub.component.html',
  styleUrl: './my-hub.component.css',
})
export class MyHubComponent {
  constructor(private dialog: MatDialog) {}
  openDialog(): void {
    this.dialog.open(RequestServiceModalComponent, {
      width: '400px', // optional
      height: '500px',
      position: { top: '0', left: '300px' },
    });
  }
}
