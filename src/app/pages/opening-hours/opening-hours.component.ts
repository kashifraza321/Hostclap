import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [],
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.css',
})
export class OpeningHoursComponent {
  pageId: string = '';
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.pageId = params.get('pageId') || '';
    });
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
}
