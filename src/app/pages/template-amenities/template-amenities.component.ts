import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-template-amenities',
  standalone: true,
  imports: [],
  templateUrl: './template-amenities.component.html',
  styleUrl: './template-amenities.component.css',
})
export class TemplateAmenitiesComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
