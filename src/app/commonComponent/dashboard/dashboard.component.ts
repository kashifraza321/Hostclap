import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { LoginService } from '../../services/login.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  text = 'small business online in less than 7 days';
  displayText = '';
  i = 0;
  isDeleting = false;
  targetIndex = 45;
  constructor() {
    this.type();
  }

  private carousel: any;

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.carousel = document.querySelector('#cardCarousel');
  }

  pauseSlider() {
    this.carousel?.carousel?.('pause');
  }

  startSlider() {
    this.carousel?.carousel?.('cycle');
  }

  type() {
    if (!this.isDeleting) {
      this.displayText = this.text.slice(0, this.i);
      this.i++;

      if (this.i === this.targetIndex) {
        this.isDeleting = true;
        setTimeout(() => this.type(), 1000); // Pause before deleting
        return;
      }
    } else {
      this.displayText = this.text.slice(0, this.i);
      this.i--;

      if (this.i === 0) {
        this.isDeleting = false;
        setTimeout(() => this.type(), 500); // Pause before typing again
        return;
      }
    }

    setTimeout(() => this.type(), this.isDeleting ? 100 : 150);
  }
}
