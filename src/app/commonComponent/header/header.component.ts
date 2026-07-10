import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  NgZone,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isFixed = false;
  dropdownOpen = false;

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
  isHalfShown = false;
  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
    private ngZone: NgZone,
    private router: Router
  ) {}

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
  // isFixed = false;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar() {
    this.isHalfShown = !this.isHalfShown;
    this.dataEvent.emit(this.isHalfShown);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.ngZone.run(() => {
      console.log('Scroll position:', window.scrollY);
      this.isFixed = window.scrollY > 50;
      console.log('Header fixed:', this.isFixed);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(`Closed with: ${result}`);
        },
        (reason) => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
