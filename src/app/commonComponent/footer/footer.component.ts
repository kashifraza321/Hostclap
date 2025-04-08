import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  dropdownOpen = true;

  countries = [
    {
      name: 'UK',
      code: 'uk',
      flag: '	/assets/images/united-kingdom-flag-icon.png',
    },
    {
      name: 'USA',
      code: 'us',
      flag: '/assets/images/united-states-flag-icon.png',
    },
    {
      name: 'Canada',
      code: 'ca',
      flag: '/assets/images/canada-flag-icon.png',
    },
    {
      name: 'India',
      code: 'in',
      flag: '/assets/images/india-flag-icon.png',
    },
  ];
  selectedCountry = this.countries[0];
  constructor(private router: Router) {}
  toggleDropdown() {
    console.log('Dropdown clicked'); // Check if this logs to the console
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.dropdownOpen = false;

    // Navigate to the route based on selected country
    this.router.navigate([`/${country.code}`]);
  }

  navigateToprivacy() {
    this.router.navigate(['/in/privacy']);
  }
  navigateToterms() {
    this.router.navigate(['/in/terms']);
  }
}
