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
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-template-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, FormsModule],
  templateUrl: './template-header.component.html',
  styleUrl: './template-header.component.css',
})
export class TemplateHeaderComponent {
  showMediaModal = false;
  toggleColorPicker = false;
  toggleCustomize = false;
  toggleBgPicker = false;
  toggleTitleColorPicker = false;
  toggleAddressBgColor = false;
  toggleAddressFontColor = false;
  toggleMenuBgColor: boolean = false;
  toggleMenuFontColor: boolean = false;

  pageId: string = '';
  activeSection: string | null = null;
  logoUrl = 'assets/logo.png';
  coverImageUrl: string | null = null;
  selectedImage: string | null = null;

  editorModules = {
    toolbar: '#custom-toolbar',
  };
  uploadedImages: string[] = [
    'assets/img1.jpg',
    'assets/img2.jpg',
    'assets/img3.jpg',
    // replace with dynamic URLs if from server
  ];
  // Forms
  announcementForm!: FormGroup;
  logoForm!: FormGroup;
  coverForm!: FormGroup;
  titlesForm!: FormGroup;
  menuForm!: FormGroup;
  contactForm!: FormGroup;
  addressForm!: FormGroup;

  coverSettings = {
    parallax: false,
    appearance: 'none',
    opacity: 100,
    backgroundColor: '#ffffff',
  };

  sectionItems = [
    {
      id: 'announcement',
      title: 'Announcement',
      icon: 'icons8-announcement-50.png',
    },
    { id: 'logo', title: 'Logo', icon: 'icons8-diamond-30.png' },
    { id: 'cover', title: 'cover', icon: 'icons8-button-24.png' },
    { id: 'Title', title: 'Title', icon: 'icons8-t-50.png' },
    { id: 'Menu', title: 'Menu', icon: 'icons8-menu-50.png' },
    { id: 'phone', title: 'phone', icon: 'icons8-image-30.png' },
    { id: 'address', title: 'address', icon: 'icons8-image-30.png' },
  ];
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }], // color picker
      [{ size: ['small', false, 'large', 'huge'] }],
      ['link'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ header: [false, 1, 2] }],
      [{ align: [] }],
    ],
  };
  // selectedImage: string | null = null;
  // userId: string = '';
  // headerForm!: FormGroup;
  // activeSection: string | null = null;
  // logoUrl = 'assets/logo.png';
  // pages: any[] = [];
  // coverImageUrl: string | null = null;
  // toggleBgPicker = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap, 'afreen');
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log('Page ID tazz:', this.pageId);

    // this.announcementForm = this.fb.group({
    //   message: [''],
    //   visible: [true],
    //   showOn: ['all'],
    //   fontSize: [1],
    //   fontColor: ['#000000'],
    //   actionButton: [false],
    //   buttonText: [''],
    //   linkTo: ['sendMessage'],
    //   openInNewTab: [false],
    // });
    this.announcementForm = this.fb.group({
      message: [''],
      visible: [true],
      showOn: ['all'],
      fontSize: [16], // px me rakhna best hai
      fontColor: ['#000000'],
      actionButton: [false],
      buttonText: [''],
      linkTo: ['sendMessage'],
      openInNewTab: [false],
    });

    // this.announcementForm.valueChanges.subscribe((val) => {
    //   this.pagesService.setPreview('announcement', val);
    // });

    this.logoForm = this.fb.group({
      logoSize: [50],
      alignment: ['center'],
    });

    this.coverForm = this.fb.group({
      // if using form controls instead of ngModel
      parallax: [false],
      appearance: ['none'],
      opacity: [100],
      backgroundColor: ['#ffffff'],
    });

    this.titlesForm = this.fb.group({
      businessName: [''],
      subtitle: [''],
      color: [''],
      font: [''],
      alignment: ['center'],
    });

    this.menuForm = this.fb.group({
      sticky: [true],
      inlineLogo: [true],
      position: ['top'],
      bgColor: ['#ffffff'],
      fontSize: [1],
      alignment: ['left'],
      fontColor: ['#000000'],
    });
    this.contactForm = this.fb.group({
      showPhone: [true],
      mobilePhone: [''],
      officePhone: [''],
      showWhatsapp: [false],
      whatsappNumber: [''],
    });
    this.addressForm = this.fb.group({
      showAddress: [false],
      addressBackgroundColor: ['#ffffff'],
      addressFontSize: [1], // 0 = small, 1 = medium, 2 = large
      addressFontColor: ['#000000'],
    });

    this.getPageDetail(this.pageId);
  }
  applyFontStyles() {
    const data = {
      message: this.announcementForm.get('message')?.value || '',
      fontSize: this.announcementForm.get('fontSize')?.value || 14,
      fontColor: this.announcementForm.get('fontColor')?.value || '#000000',
    };

    this.pagesService.setPreview('announcement', data);
  }

  announcementMessage: string = 'AC is not working?';

  goBack() {
    this.router.navigateByUrl('/in/insight/editor/home');
  }

  toggleSection(sectionId: string) {
    if (this.activeSection && this.activeSection !== sectionId) {
      this.saveSection(this.activeSection);
    }
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
      // this.headerForm.patchValue({ logo: this.selectedImage });
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
    // this.headerForm.patchValue({ logo: '' });
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

  editCoverImage() {
    // Open media library or file selector
    console.log('Edit cover image');
  }

  removeCoverImage() {
    this.coverImageUrl = null;
  }

  // form data
  saveSection(section: string) {
    let payload: any;
    switch (section) {
      case 'announcement':
        payload = this.announcementForm.value;
        break;
      case 'logo':
        payload = this.logoForm.value;
        break;
      case 'titles':
        payload = this.titlesForm.value;
        break;
      case 'menu':
        payload = this.menuForm.value;
        break;
      case 'cover':
        payload = this.coverForm.value;
        break;
      case 'phone':
        payload = this.contactForm.value;
        break;
      case 'address':
        payload = this.addressForm.value;
        break;
      default:
        return;
    }

    this.pagesService.updateHeader(this.pageId, section, payload).subscribe({
      next: (res) => {
        console.log('Page ID in saveSection:', this.pageId);
        // alert(`${section} saved successfully.`);
        this.alertService.success(`${section} saved successfully`);
        console.log('Alert called!');
      },
      error: (err) => {
        alert(`Failed to save ${section}.`);
        this.alertService.error(`Failed to save ${section}`);
      },
    });
  }
}
