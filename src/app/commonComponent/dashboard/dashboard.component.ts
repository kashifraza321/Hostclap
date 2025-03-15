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
  constructor(private _dashboardData: LoginService) {}
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

  //pie chart ends here
}
