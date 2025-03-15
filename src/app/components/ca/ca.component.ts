import { Component } from '@angular/core';

@Component({
  selector: 'app-ca',
  standalone: true,
  imports: [],
  templateUrl: './ca.component.html',
  styleUrl: './ca.component.css',
})
export class CaComponent {
  private carousel: any;

  ngAfterViewInit() {
    this.carousel = document.querySelector('#cardCarousel');
  }

  pauseSlider() {
    this.carousel?.carousel?.('pause');
  }

  startSlider() {
    this.carousel?.carousel?.('cycle');
  }
}
