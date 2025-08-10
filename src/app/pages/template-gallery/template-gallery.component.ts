import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [],
  templateUrl: './template-gallery.component.html',
  styleUrl: './template-gallery.component.css',
})
export class TemplateGalleryComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
