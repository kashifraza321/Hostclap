import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-template-services',
  standalone: true,
  imports: [],
  templateUrl: './template-services.component.html',
  styleUrl: './template-services.component.css',
})
export class TemplateServicesComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
