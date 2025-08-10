import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/in/insight/editor');
  }
}
