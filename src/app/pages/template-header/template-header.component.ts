import { Component } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../pages.service';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-template-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, FormsModule],
  templateUrl: './template-header.component.html',
  styleUrl: './template-header.component.css',
})
export class TemplateHeaderComponent {
  showMediaModal = false;
  // sectionItems: any[] = [];
  showAnnouncement = true;
  showOn: 'all' | 'home' = 'all';
  // announcementText = "AC isn't <u>working</u>?";
  editorContent = '';
  pageId: string = '';
  editorModules = {
    toolbar: '#custom-toolbar',
  };
  uploadedImages: string[] = [
    'assets/img1.jpg',
    'assets/img2.jpg',
    'assets/img3.jpg',
    // replace with dynamic URLs if from server
  ];
  sectionItems = [
    {
      id: 'announcement',
      title: 'Announcement',
      icon: 'icons8-announcement-50.png',
    },
    { id: 'logo', title: 'Logo', icon: 'icons8-diamond-30.png' },
    { id: 'cta', title: 'CTA Button', icon: 'icons8-button-24.png' },
    { id: 'Title', title: 'Title', icon: 'icons8-t-50.png' },
    { id: 'Menu', title: 'Menu', icon: 'icons8-menu-50.png' },
    { id: 'Freme', title: 'Frame', icon: 'icons8-image-30.png' },
  ];
  selectedImage: string | null = null;
  userId: string = '';
  headerForm!: FormGroup;
  activeSection: string | null = null;
  logoUrl = 'assets/logo.png';
  pages: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pagesService: PagesService
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log('Page ID:', this.pageId);

    this.headerForm = this.fb.group({
      announcement: this.fb.group({
        message: [''],
        visible: [true],
        showOn: ['all'],
      }),
      logo: this.fb.group({
        url: [''],
        size: [50],
        alignment: ['center'],
      }),
      cta: this.fb.group({
        text: [''],
        link: [''],
      }),
      titles: this.fb.group({
        businessName: [''],
        subtitle: [''],
        color: [''],
        font: [''],
        alignment: ['center'],
      }),
      menu: this.fb.group({
        home: [''],
        services: [''],
        contact: [''],
      }),
    });

    this.getPageDetail(this.pageId);
  }

  announcementMessage: string = 'AC is not working?';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ header: [false, 1, 2] }],
      [{ align: [] }],
    ],
  };
  // [ngModel] = 'announcementMessage';

  goBack() {
    this.router.navigateByUrl('/in/insight/editor/home');
  }

  toggleSection(sectionId: string): void {
    if (this.activeSection && this.activeSection !== sectionId) {
      // Save current section before switching
      this.saveSection(this.activeSection);
    }

    // Toggle logic
    this.activeSection = this.activeSection === sectionId ? null : sectionId;
  }

  openMediaLibrary(): void {
    this.showMediaModal = true;
  }

  closeMediaLibrary(): void {
    this.showMediaModal = false;
    this.selectedImage = null;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  chooseImage(): void {
    if (this.selectedImage) {
      this.headerForm.patchValue({ logo: this.selectedImage });
      this.logoUrl = this.selectedImage;
      this.closeMediaLibrary();
    }
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  editLogo(): void {
    console.log('Edit logo clicked');
    this.openMediaLibrary();
  }

  removeLogo(): void {
    this.logoUrl = '';
    this.headerForm.patchValue({ logo: '' });
  }

  getPageDetail(id: string): void {
    this.pagesService.getPageDetail(id).subscribe({
      next: (res) => {
        console.log('Page Detail:', res);
        // you can update form values here if needed
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }

  // form data
  saveSection(section: string) {
    let payload: any = {}; // ✅ no userId

    switch (section) {
      case 'announcement':
        payload.announcement = {
          show: this.headerForm.get('show')?.value,
          message: this.headerForm.get('message')?.value,
        };
        break;

      case 'logo':
        payload.logo = {
          url: this.headerForm.get('logo')?.value,
          size: this.headerForm.get('logoSize')?.value,
          alignment: this.headerForm.get('alignment')?.value,
        };
        break;

      default:
        console.warn('Unknown section:', section);
        return;
    }

    // ✅ Use pageId here
    this.pagesService
      .updateHeader(this.pageId, section, payload[section])
      .subscribe({
        next: (res) => {
          console.log(`${section} updated`, res);
          alert(`${section} saved successfully.`);
        },
        error: (err) => {
          console.error(`Failed to update ${section}`, err);
        },
      });
  }
}
