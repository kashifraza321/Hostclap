import { Component } from '@angular/core';
import { InsightHeaderComponent } from '../insight-header/insight-header.component';

@Component({
  selector: 'app-pro-features',
  standalone: true,
  imports: [InsightHeaderComponent],
  templateUrl: './pro-features.component.html',
  styleUrl: './pro-features.component.css',
})
export class ProFeaturesComponent {}
