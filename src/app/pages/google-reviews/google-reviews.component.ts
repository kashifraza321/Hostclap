import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-reviews',
  standalone: true,
  imports: [],
  templateUrl: './google-reviews.component.html',
  styleUrl: './google-reviews.component.css',
})
export class GoogleReviewsComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
