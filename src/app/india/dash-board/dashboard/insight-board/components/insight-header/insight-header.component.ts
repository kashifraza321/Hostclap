import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-insight-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './insight-header.component.html',
  styleUrl: './insight-header.component.css',
})
export class InsightHeaderComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }
}
