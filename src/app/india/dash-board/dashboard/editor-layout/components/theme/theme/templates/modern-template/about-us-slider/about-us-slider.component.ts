import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us-slider.component.html',
  styleUrl: './about-us-slider.component.css',
})
export class AboutUsSliderComponent {
  currentSlide: number = 0;

  slides = [
    {
      image: 'assets/images/girlimg.jpeg',
      title: 'Wedding Makeup Artist Ranchi',
      description: `Welcome to Zoe Makeup Artist, your trusted wedding makeup artist in Ranchi. At Zoe, we understand that your wedding day is a momentous occasion, and we are here to ensure you look nothing short of stunning on your special day.`,
      linkText: 'Learn More',
      link: '#',
    },
    {
      image: 'assets/images/twogrils.png',
      title: 'Engagement Makeup Services',
      description: `Get flawless makeup for your engagement ceremony. We craft looks that enhance your natural beauty while staying photo-ready all day.`,
      linkText: 'Explore Engagement Looks',
      link: '#',
    },
    {
      image: 'assets/images/shoppinggirl.png',
      title: 'Reception Glam',
      description: `Your reception deserves a stunning makeover too. Our glamorous looks are perfect for your reception night celebrations.`,
      linkText: 'See Reception Styles',
      link: '#',
    },
    {
      image: 'assets/images/image4.jpg',
      title: 'Pre-Wedding Shoots',
      description: `We specialize in natural, soft glam makeup ideal for pre-wedding shoots. Highlight your best features with camera-ready artistry.`,
      linkText: 'Book a Session',
      link: '#',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  selectSlide(index: number): void {
    this.currentSlide = index;
  }
  moveSlide(direction: number): void {
    const totalSlides = this.slides.length;
    this.currentSlide =
      (this.currentSlide + direction + totalSlides) % totalSlides;
  }
}
