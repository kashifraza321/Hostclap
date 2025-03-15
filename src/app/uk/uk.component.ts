import { Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-uk',
  standalone: true,
  imports: [],
  templateUrl: './uk.component.html',
  styleUrl: './uk.component.css',
})
export class UkComponent {
  @ViewChild('imageContent', { static: false }) imageContent!: ElementRef;
  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.left-phone', {
      x: '-177px',
      rotate: '-8deg',
      scrollTrigger: {
        trigger: this.imageContent.nativeElement,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 0.3,
      },
    });

    gsap.to('.right-phone', {
      x: '177px',
      rotate: '8deg',
      scrollTrigger: {
        trigger: this.imageContent.nativeElement,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 0.3,
      },
    });

    gsap.to('.middle-phone', {
      y: '0px', // Middle phone stays in place
      scrollTrigger: {
        trigger: this.imageContent.nativeElement,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 0.3,
      },
    });
  }
}
