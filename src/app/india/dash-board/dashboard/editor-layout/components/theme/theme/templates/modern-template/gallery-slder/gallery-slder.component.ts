import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-slder',
  standalone: true,
  imports: [],
  templateUrl: './gallery-slder.component.html',
  styleUrl: './gallery-slder.component.css'
})
export class GallerySlderComponent {

private get sliderWidth(): number {
  const slider = document.getElementById('ts-slider');
  return slider ? slider.offsetWidth : window.innerWidth;
}
  private animationSpeed = 1000; // ms
  private pauseTime = 2000; // ms
  private currentSlide = 1;
  private intervalId: number | null = null;

  private slideWrapper!: HTMLElement;
  private allSlides!: NodeListOf<HTMLElement>;
  private header!: HTMLElement;

  ngAfterViewInit(): void {
    const slider = document.getElementById('ts-slider');
    if (!slider) return;

    this.slideWrapper = slider.querySelector('.slides') as HTMLElement;
    this.allSlides = slider.querySelectorAll('.slide');
    this.header = document.querySelector('.header') as HTMLElement;

    this.startSlider();

    // Pause / resume and header animations
    this.slideWrapper.addEventListener('mouseenter', () => {
      this.stopSlider();
      this.showHeader();
    });

    this.slideWrapper.addEventListener('mouseleave', () => {
      this.startSlider();
      this.hideHeader();
    });

  
  }

  ngOnDestroy(): void {
    this.stopSlider();
   
  }


  private startSlider(): void {
    this.stopSlider(); // clear previous
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, this.pauseTime);
  }

  private stopSlider(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private nextSlide(): void {
    this.slideWrapper.style.transition = `margin-left ${this.animationSpeed}ms ease`;
    this.slideWrapper.style.marginLeft = `-${this.sliderWidth * this.currentSlide}px`;

    this.currentSlide++;

    if (this.currentSlide === this.allSlides.length) {
      // Reset back to start after animation
      setTimeout(() => {
        this.slideWrapper.style.transition = 'none';
        this.slideWrapper.style.marginLeft = '0px';
        this.currentSlide = 1;
      }, this.animationSpeed);
    }
  }

  private showHeader(): void {
    this.header.style.display = 'block';
    this.header.style.transition = 'all 0.5s';
    this.header.style.opacity = '1';
  }

  private hideHeader(): void {
    this.header.style.transition = 'all 0.5s';
    this.header.style.opacity = '0';
    setTimeout(() => {
      this.header.style.display = 'none';
    }, 500);
  }
}
