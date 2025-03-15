import { Component } from '@angular/core';

@Component({
  selector: 'app-ca',
  standalone: true,
  imports: [],
  templateUrl: './ca.component.html',
  styleUrl: './ca.component.css',
})
export class CaComponent
{
  
  private carousel: any;
   text = 'your Local Business';
  displayText = '';
  i = 0;
  isDeleting = false;
  targetIndex = 20; 
constructor() {
    this.type();
  }
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
