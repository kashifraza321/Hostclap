import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css',
})
export class SectionsComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/in/insight/editor');
  }
}
