import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart, { ChartConfiguration } from 'chart.js/auto';
// import { NgChartsModule } from 'ng2-charts';
import * as echarts from 'echarts';
import { InsightHeaderComponent } from '../insight-header/insight-header.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, InsightHeaderComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  constructor() {}

  ngOnInit(): void {
    const chartDom = this.chartContainer.nativeElement;
    const myChart = echarts.init(chartDom);

    const option: echarts.EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    };

    myChart.setOption(option);
  }
}
