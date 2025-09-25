import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-review-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-slider.component.html',
  styleUrl: './review-slider.component.css',
})
export class ReviewSliderComponent {
  currentIndex = 0;

  reviews = [
    {
      text: 'Huge shoutout to Zoe and team, for making me feel so beautiful 💖 ...',
      date: 'Jul 2, 2025',
      rating: 5,
      name: 'Sis Tee',
      initial: 'S',
    },
    {
      text: 'Thnkyou soo soo much Zoe for the amazing makeup for my nikah...',
      date: 'Jun 26, 2025',
      rating: 5,
      name: 'Arshi Saniya',
      initial: 'A',
    },
    {
      text: 'Loved the experience with Aziza and the team...',
      date: 'May 20, 2025',
      rating: 5,
      name: 'Avni Mohan',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
  ];

  next() {
    if (this.currentIndex < this.reviews.length - 3) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
