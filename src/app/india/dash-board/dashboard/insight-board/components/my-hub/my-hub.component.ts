import { Component } from '@angular/core';
import { InsightHeaderComponent } from '../insight-header/insight-header.component';

@Component({
  selector: 'app-my-hub',
  standalone: true,
  imports: [InsightHeaderComponent],
  templateUrl: './my-hub.component.html',
  styleUrl: './my-hub.component.css',
})
export class MyHubComponent {}
