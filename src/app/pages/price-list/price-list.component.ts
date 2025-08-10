import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.css',
})
export class PriceListComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
