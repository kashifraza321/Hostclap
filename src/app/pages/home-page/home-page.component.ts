import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TemplateHeaderComponent } from '../template-header/template-header.component';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TemplateHeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  homeForm!: FormGroup;
  sectionForm!: FormGroup;
  userId: string = '';
  showHeader = false;
  selectedSection: string = 'home';
  pageId: string = '';
  pageData: any;
  pages: any[] = [];
  sectionId: string = '';
  // sections: { name: string; key: string }[] = [];
  sections = [
    { name: 'Header', key: 'header' },
    { name: 'Banner', key: 'banner' },
    { name: 'About Us', key: 'about' },
    { name: 'About Us', key: 'about' },
    { name: 'About Us', key: 'about' },
  ];

  pageForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log('Page ID:', this.pageId);

    this.homeForm = this.fb.group({
      pageName: ['Home'],
      isActive: [true],
    });
    console.log('Sections list cnsdcndscnd:', this.sections);
    console.log('pageID hain kyaaaaa', this.pageId);
    console.log(' Sections Initialized:', this.sections);
    console.log(' selectedSection:', this.selectedSection);
    this.getPageData();
    this.sectionForm = this.fb.group({
      sectionTitle: ['service title', Validators.required],
      sectionSubtitle: ['service subtitle', Validators.required],
    });
  }
  // openSection(section: string) {
  //   this.selectedSection = section;
  // }
  openServices(pageId: string) {
    console.log(pageId, 'pageidddddddddddd');

    if (this.sectionForm.invalid) {
      this.alertService.error('Please fill all required fields');
      return;
    }

    const data = {
      sectionType: 'service',
      sectionTitle: this.sectionForm.value.sectionTitle,
      sectionSubtitle: this.sectionForm.value.sectionSubtitle,
      pageId: pageId,
    };

    this.pagesService.createSection(data).subscribe({
      next: (res) => {
        this.sectionId = res.data._id;
        this.alertService.success('Service section created successfully');

        this.router.navigate(['/in/insight/editor/services', pageId]);
      },
      error: () => {
        this.alertService.error('Failed to create service section');

        // this.router.navigate(['/in/insight/editor/services', pageId]);
      },
    });
  }

  addSection(): void {
    console.log('Add Section Clicked');
  }

  editSections(): void {
    console.log('Edit Clicked');
  }

  selectSection(key: string) {
    this.selectedSection = key;
  }
  goBack() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  openHeader(pageId: string) {
    console.log(pageId, 'pageidddddddddddd');
    this.router.navigate(['/in/insight/editor/header', pageId]);
  }
  // openServices(pageId: string) {
  //   console.log(pageId, 'pageidddddddddddd');
  //   this.router.navigate(['/in/insight/editor/services', pageId]);
  // }
  navigateToGallery() {
    console.log('pageidddddddddddd');
    this.router.navigate(['/in/insight/editor/gallery']);
  }
  navigateToOPeningHours() {
    this.router.navigate(['/in/insight/editor/opening-hours']);
  }
  navigateToContact(pageId: string) {
    this.router.navigate(['/in/insight/editor/contact-us', pageId]);
  }
  navigateToFooter(pageId: string) {
    this.router.navigate(['/in/insight/editor/template-footer', pageId]);
  }
  navigateToPromotion(pageId: string) {
    this.router.navigate(['/in/insight/editor/Promotion', pageId]);
  }
  navigateToReview() {
    this.router.navigate(['/in/insight/editor/reviews']);
  }
  navigateToAmenties(pageId: string) {
    this.router.navigate(['/in/insight/editor/amenities', pageId]);
  }
  navigateToPriceList(pageId: string) {
    console.log(pageId, 'pageidddddddddddd');

    if (this.sectionForm.invalid) {
      this.alertService.error('Please fill all required fields');
      return;
    }

    const data = {
      sectionType: 'price_list',
      sectionTitle: this.sectionForm.value.sectionTitle,
      sectionSubtitle: this.sectionForm.value.sectionSubtitle,
      pageId: pageId,
    };

    this.pagesService.createSection(data).subscribe({
      next: (res) => {
        this.sectionId = res.data._id;
        this.alertService.success('Service section created successfully');

        this.router.navigate(['/in/insight/editor/price-list', pageId]);
      },
      error: () => {
        this.alertService.error('Failed to create service section');

        // this.router.navigate(['/in/insight/editor/services', pageId]);
      },
    });
    // this.router.navigate(['/in/insight/editor/price-list', pageId]);
  }
  navigateToContactForm(pageId: string) {
    this.router.navigate(['/in/insight/editor/contact-form', pageId]);
  }
  openSection(key: string) {
    this.router.navigate(['/in/insight/editor', key]);
  }
  onSectionClick(section: { name: string; key: string }) {
    if (section.key === 'header') {
      this.openHeader(this.pageId);
    } else {
      console.log(`Section clicked: ${section.name} (Not implemented)`);
    }
  }

  // openSection(section: string) {
  //   console.log('Opening section:', section);
  //   this.selectedSection = section;
  // }
  onSubmit() {}

  getPageData(): void {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          console.log('Full API Response:', res);
          this.pageData = res.data;

          console.log('Page Data:', this.pageData);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }
}
