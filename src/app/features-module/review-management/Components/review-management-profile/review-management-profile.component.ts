import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../../Module/material.module';
import { SearchComponent } from '../../../subscription-management/Components/search/search.component';


@Component({
  selector: 'app-review-management-profile',
  standalone: true,
  imports: [SearchComponent,MaterialModule],
  templateUrl: './review-management-profile.component.html',
  styleUrl: './review-management-profile.component.scss'
})
export class ReviewManagementProfileComponent {
  
  constructor(private router: Router) { }

  redireToReportedBy() {
    this.router.navigate([`/review-management/reported-by`])
  }
}
