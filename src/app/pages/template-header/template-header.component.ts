import { Component, Input } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../pages.service';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { merge, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any;

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
  logoPreview: SafeResourceUrl | null = null;
  uploadedImages: string[] = [];
  pageData: any;
  imgurl = environment.imageBaseUrl;
  pageId: string = '';
  activeSection: string | null = null;
  logoUrl = 'assets/logo.png';
  coverImageUrl: SafeResourceUrl | null = null;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  selectedLogoFile: File | null = null;
  data = {
    logo: '', // 👈 default value, baad me API se overwrite hoga
  };
  editorModules = {
    toolbar: '#custom-toolbar',
  };

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
    { id: 'address', title: 'address', icon: 'icons8-menu-50.png' },
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
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap, 'afreen');
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log('Page ID tazz:', this.pageId);

    this.announcementForm = this.fb.group({
      message: [''],
      show: [true],
      showOn: ['all'],
      fontSize: [16],
      fontColor: ['#000000'],
      actionButton: this.fb.group({
        // enabled: [],
        buttonName: [''],
        linkType: ['external'],
        // link: [''],
      }),
      openInNewTab: [false],
    });
    // this.announcementForm.valueChanges.subscribe((val) => {
    //   this.pagesService.updatePreviewSection('announcement', val);
    // });

    this.logoForm = this.fb.group({
      image: [''],
      logoSize: [50],
      alignment: ['center'],
    });
    // this.logoForm.valueChanges.subscribe((val) => {
    //   this.pagesService.updatePreviewSection('logo', val);
    // });

    this.coverForm = this.fb.group({
      type: ['image'],
      image: [''],
      parallax: [false],
      appearanceEffect: ['none'],
      opacity: [100],
      backgroundColor: ['#ffffff'],
    });

    this.coverForm.get('opacity')?.valueChanges.subscribe((val) => {
      console.log('🎚️ Opacity changed =>', val, typeof val);
    });
    this.titlesForm = this.fb.group({
      buisnessName: [''],
      pageTitle: ['', [Validators.maxLength(80)]],
      titleFont: ['Roboto'],
      titleAlignment: ['center'],
      titleColour: [''],
      subtitle: ['', [Validators.maxLength(200)]],
      subtitleFont: ['Open Sans'],
      subtitleAlignment: [''],
      subtitleColour: [''],
      branding: [true],
    });

    this.menuForm = this.fb.group({
      stickyMenu: [true],
      logoInLine: [true],
      menuPosition: ['top'],
      menuBackgroudColour: [''],
      menuFontColour: ['#000000'],
      fontSize: ['16'],
      alignment: ['middle'],
    });

    this.contactForm = this.fb.group({
      phones: this.fb.group({
        mobile: [''],
        office: [''],
        whatsapp: [''],
      }),
    });
    this.addressForm = this.fb.group({
      line1: [''],
      line2: [''],
    });
    // ==== Short realtime update ====
    merge(
      this.announcementForm.valueChanges.pipe(
        tap((val) =>
          // this.pagesService.updatePreviewSection('announcement', val)

          this.applyFontStyles()
        )
      ),
      this.titlesForm.valueChanges.pipe(
        tap(
          (val) => this.applyTitleChanges()
          // this.pagesService.updatePreviewSection('titles', val)
        )
      ),
      this.menuForm.valueChanges.pipe(
        tap((val) =>
          // this.pagesService.updatePreviewSection('menu', val)
          this.applyMenuChanges()
        )
      ),
      this.coverForm.valueChanges.pipe(tap(() => this.applyCoverChanges())),
      this.logoForm.valueChanges.pipe(tap(() => this.applyLogoChanges()))
    ).subscribe();

    this.getPageDetail(this.pageId);
  }
  // realtime data show logic
  applyFontStyles() {
    const val = this.announcementForm.value;
    const showAnnouncement = val.show;

    const data = {
      message: this.announcementForm.get('message')?.value || '',
      fontSize: this.announcementForm.get('fontSize')?.value || 14,
      fontColor: this.announcementForm.get('fontColor')?.value || '#000000',
      actionButton: this.announcementForm.get('actionButton.enabled')?.value
        ? {
            buttonText:
              this.announcementForm.get('actionButton.buttonName')?.value ||
              'Send a message',
            linkType:
              this.announcementForm.get('actionButton.linkType')?.value ||
              'sendMessage',
            link: this.announcementForm.get('actionButton.link')?.value || '',
            fontSize: this.announcementForm.get('fontSize')?.value || 14,
          }
        : false,
      show: showAnnouncement,
    };

    this.pagesService.updatePreviewSection('announcement', data);
  }
  applyTitleChanges() {
    const data = {
      buisnessName: this.titlesForm.get('buisnessName')?.value || '',
      subtitle: this.titlesForm.get('subtitle')?.value || '',
      titleColour: this.titlesForm.get('titleColour')?.value || '',
      subtitleColour: this.titlesForm.get('subtitleColour')?.value || '',
      titleAlignment: this.titlesForm.get('titleAlignment')?.value || 'center',
      subtitleAlignment:
        this.titlesForm.get('subtitleAlignment')?.value || 'center',
    };
    this.pagesService.updatePreviewSection('titles', data);
  }
  applyMenuChanges() {
    const data = {
      stickyMenu: this.menuForm.get('stickyMenu')?.value ?? true,
      logoInLine: this.menuForm.get('logoInLine')?.value ?? true,
      menuPosition: this.menuForm.get('menuPosition')?.value || 'top',
      menuBackgroudColour:
        this.menuForm.get('menuBackgroudColour')?.value || '',
      menuFontColour: this.menuForm.get('menuFontColour')?.value || '#000000',
      fontSize: this.menuForm.get('fontSize')?.value + 'px',
      alignment: this.menuForm.get('alignment')?.value || 'middle',
    };
    this.pagesService.updatePreviewSection('menu', data);
  }

  applyCoverChanges() {
    const data = {
      image: this.coverForm.get('image')?.value || '',
      appearanceEffect: this.coverForm.get('appearanceEffect')?.value || 'none',
      opacity: this.coverForm.get('opacity')?.value || 100,
    };

    this.pagesService.updatePreviewSection('cover', data);
  }
  applyLogoChanges() {
    const data = {
      image: this.logoForm.get('image')?.value || '',
      logoSize: this.logoForm.get('logoSize')?.value || 100,
      alignment: this.logoForm.get('alignment')?.value || 'center',
    };

    this.pagesService.updatePreviewSection('logo', data);
  }
  announcementMessage: string = 'AC is not working?';
  // realtime data show logic
  onOpacityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = +input.value; // number me convert
    this.coverForm.get('opacity')?.setValue(value);
  }
  handleImageError(event: any) {
    event.target.src = 'path-to-fallback-image.jpg';
  }

  goBack() {
    console.log('pageidddddddddddd');
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }

  toggleSection(sectionId: string) {
    if (this.activeSection && this.activeSection !== sectionId) {
      this.saveSection(this.activeSection);
    }
    this.activeSection = this.activeSection === sectionId ? null : sectionId;
  }

  // logo modal  code ========
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
    if (!this.selectedImage) return;

    this.logoPreview = this.selectedImage;
    this.logoForm.patchValue({ image: this.selectedImage });

    this.convertImageToFile(this.selectedImage).then((file) => {
      this.selectedLogoFile = file;
    });

    this.closeMediaLibrary();
  }
  async convertImageToFile(imageUrlOrBase64: string): Promise<File> {
    const res = await fetch(imageUrlOrBase64);
    const blob = await res.blob();
    const fileName = 'logo_' + new Date().getTime() + '.png';
    return new File([blob], fileName, { type: blob.type });
  }

  removeLogo(): void {
    this.logoForm.patchValue({ image: '' });
    this.logoUrl = '';
  }
  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageBase64 = e.target.result;
        this.uploadedImages.push(imageBase64);
        this.selectedImage = imageBase64;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];

      // Patch karein agar reactive form me file rakhni hai
      this.logoForm.patchValue({ image: this.selectedLogoFile });

      console.log('File selected:', this.selectedLogoFile);
    }
  }

  // logo modal =========
  // cover modal code
  openCoverModal(): void {
    const modalEl = document.getElementById('coverEditorModal');
    if (modalEl) {
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
      }
      modalInstance.show();
    }
  }

  onCoverImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // this.selectedCoverFile = file; // save file here

      const reader = new FileReader();
      reader.onload = () => {
        this.coverForm.patchValue({ image: reader.result as string });
        this.coverImageUrl = reader.result as string;
        this.closeMediaLibrary();
      };
      reader.readAsDataURL(file);
    }
  }
  chooseCoverImage(): void {
    if (!this.selectedImage) return;

    // Patch the form with selected image
    this.coverForm.patchValue({ image: this.selectedImage });
    this.coverImageUrl = this.selectedImage;
    this.applyCoverChanges();

    // Find modal element
    const modalEl = document.getElementById('coverEditorModal');
    if (modalEl) {
      // Check if modal instance already exists
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalEl);
      }
      modalInstance.hide();
    } else {
      console.error('Modal element not found!');
    }

    // Reset selected image
    this.selectedImage = null;
  }

  removeCoverImage() {
    this.coverForm.patchValue({ image: '' });
  }
  editCoverImage() {
    console.log('Edit cover image');
  }
  // cover modal code
  getPageDetail(id: string): void {
    this.pagesService.getPageDetail(id).subscribe({
      next: (res) => {
        console.log('Page Detail:', res);
        if (res?.status === 200 && res.data) {
          this.pageData = res.data;
          console.log('pageData set:', this.pageData);

          const logo = res?.data?.header?.logo;

          const fullImagePath = logo?.image
            ? `${this.imgurl}${logo.image}`.trim()
            : 'assets/images/dummy-logo.png';

          const safeImageUrl: SafeResourceUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(fullImagePath);
          this.logoForm.patchValue({
            image: safeImageUrl,
            alignment: logo?.alignment || 'center',
            logoSize: +logo?.size || 50,
          });

          this.logoPreview = safeImageUrl;

          // --- Cover ---
          const cover = res.data.header.cover; // assuming your API has cover under header.cover
          if (cover?.image) {
            const fullCoverPath = `${this.imgurl}${cover.image}`.trim();
            // const safeCoverUrl =
            //   this.sanitizer.bypassSecurityTrustResourceUrl(fullCoverPath);
            // this.coverImageUrl = safeCoverUrl;
            this.coverForm.patchValue({
              image: fullCoverPath,
              appearanceEffect: cover.appearanceEffect ?? 'none',
              opacity: Number(cover.opacity) || 100,
              parallax: cover.parallax ?? false,
              backgroundColour: cover.backgroundColour ?? '#ffffff',
            });

            this.coverImageUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(fullCoverPath);
          }
          console.log(
            'Form opacity type:',
            typeof this.coverForm.get('opacity')?.value
          );

          console.log(' LogoForm after patch:', this.logoForm.value);
        }
        const titles = res.data.header.titles;
        if (titles) {
          this.titlesForm.patchValue({
            buisnessName: titles.buisnessName || 'My Business',
            pageTitle: titles.pageTitle || 'Welcome to My Page',
            titleFont: titles.titleFont || 'Roboto',
            titleAlignment: titles.titleAlignment || 'center',
            titleColour: titles.titleColour || '#000000',
            subtitle: titles.subtitle || '',
            subtitleFont: titles.subtitleFont || 'Open Sans',
            subtitleAlignment: titles.subtitleAlignment || 'center',
            subtitleColour: titles.subtitleColour || '#000000',
          });
        }
        const announcement = res?.data?.header?.announcement;

        if (announcement) {
          this.announcementForm.patchValue({
            show: announcement.show || false,
            message: announcement.message || '',
            fontSize: announcement.fontSize || 16,
            fontColor: announcement.fontColor || '#000000',
            actionButton: {
              // enabled: announcement.actionButton?.enabled ?? false,
              buttonName: announcement.actionButton?.buttonName || '',
              linkType: announcement.actionButton?.linkType || 'sendMessage',
            },
          });
        }
        const menu = res.data.header.menu;
        if (menu) {
          this.menuForm.patchValue({
            stickyMenu: menu.stickyMenu ?? false,
            logoInLine: menu.logoInLine ?? false,
            menuBackgroudColour: menu.menuBackgroudColour || '#ffffff',
            fontSize: menu.fontSize || 16,
            alignment: menu.alignment || 'left',
            menuFontColour: menu.menuFontColour || '#000000',
          });

          console.log('📝 MenuForm after patch:', this.menuForm.value);
        }
        const phones = res.data.header?.phones;
        if (phones) {
          this.contactForm.patchValue({
            phones: {
              mobile: phones.mobile || '',
              office: phones.office || '',
              whatsapp: phones.whatsapp || '',
            },
          });
        }
        const data = res?.data?.header?.addressLine;

        if (data) {
          this.addressForm.patchValue({
            line1: data.line1 || '',
            line2: data.line2 || '',
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pagesService.updateLogoHeader(this.pageId, file).subscribe({
        next: (res) => {
          console.log('Logo updated successfully', res);
        },
        error: (err) => {
          console.error('Error uploading logo', err);
        },
      });
    }
  }

  // nw logo
  saveLogo(): void {
    const logoFile = this.selectedLogoFile;
    const logoSize = this.logoForm.get('logoSize')?.value || 'small';
    const alignment = this.logoForm.get('alignment')?.value || 'center';
    const coverVal = this.coverForm.value;
    const coverImage = coverVal.image;

    const formData = new FormData();

    if (logoFile) {
      formData.append('type', 'logo');
      formData.append('size', logoSize);
      formData.append('alignment', alignment);
      formData.append('image', logoFile);
    }

    if (coverImage) {
      this.convertImageToFile(coverImage).then((coverFile) => {
        formData.append('type', 'cover');
        formData.append('image', coverFile);
        formData.append('appearanceEffect', coverVal.appearanceEffect);
        formData.append('opacity', String(Number(coverVal.opacity)));
        formData.append('backgroundColour', coverVal.backgroundColour);
        formData.append('parallax', String(coverVal.parallax));

        this.pagesService.updateLogoHeader(this.pageId, formData).subscribe({
          next: () => {
            this.alertService.success('Header updated successfully');
            this.selectedLogoFile = null;
            this.getPageDetail(this.pageId);
          },
          error: () => {
            this.alertService.error('Failed to update header section');
          },
        });
      });
    } else {
      if (logoFile) {
        this.pagesService.updateLogoHeader(this.pageId, formData).subscribe({
          next: () => {
            this.alertService.success('Header updated successfully');
            this.selectedLogoFile = null;
          },
          error: () => {
            this.alertService.error('Failed to update header section');
          },
        });
      } else {
        this.alertService.error('Please select a logo or cover image.');
      }
    }
  }

  // nw logo

  // form data
  saveSection(section: string) {
    let payload: any;
    switch (section) {
      case 'announcement':
        const val = this.announcementForm.value;
        let cleanMsg = val.message?.replace(/<\/?[^>]+(>|$)/g, '').trim();

        payload = {
          announcement: {
            show: !!val.show,
            message: cleanMsg || 'Announcement', // empty avoid karo
            fontSize: `${val.fontSize}`,
            actionButton: {
              buttonName: val.actionButton?.buttonName || '',
              linkType: val.actionButton?.linkType || 'external', // safe default
              link: val.actionButton?.link || '',
            },
          },
        };

        break;
      // case 'logo': {
      //   const val = this.logoForm.value;

      //   const formData = new FormData();
      //   formData.append('size', 'small');
      //   formData.append('type', 'logo');
      //   if (this.selectedFile) {
      //     formData.append('image', this.selectedFile);
      //   } else if (this.selectedImage) {
      //     formData.append('image', this.selectedImage);
      //   }

      //   this.pagesService.updateLogoHeader(this.pageId, formData).subscribe({
      //     next: (res) => {
      //       this.alertService.success('Logo updated successfully');
      //       console.log('Logo updated response:', res);
      //     },
      //     error: (err) => {
      //       this.alertService.error('Failed to update logo');
      //       console.error('Logo update error:', err);
      //     },
      //   });

      //   break;
      // }

      case 'titles':
        {
          const val = this.titlesForm.value;
          payload = {
            titles: {
              buisnessName: val.buisnessName,
              pageTitle: val.pageTitle,
              titleFont: val.titleFont,
              titleAlignment: val.titleAlignment,
              titleColour: val.titleColour,
              subtitle: val.subtitle,
              subtitleFont: val.subtitleFont,
              subtitleAlignment: val.subtitleAlignment,
              subtitleColour: val.subtitleColour,
              branding: val.branding,
            },
          };
        }
        break;
      case 'menu':
        {
          const val = this.menuForm.value;
          console.log('Menu Form Payload:', val);
          payload = {
            menu: {
              stickyMenu: val.stickyMenu,
              logoInLine: val.logoInLine,
              menuPosition: val.menuPosition,
              menuBackgroudColour: val.menuBackgroudColour,
              menuFontColour: val.menuFontColour,
              fontSize: `${val.fontSize}px`,
              alignment: val.alignment,
            },
          };
        }

        break;
      // case 'cover': {
      //   const val = this.coverForm.value;
      //   payload = {
      //     cover: {
      //       type: val.type,
      //       image: val.image,
      //       parallax: val.parallax,
      //       appearance: val.appearance,
      //       opacity: val.opacity,
      //       backgroundColor: val.backgroundColor,
      //     },
      //   };

      //   break;
      // }
      case 'phone': {
        const val = this.contactForm.get('phones')?.value;
        payload = {
          phones: {
            mobile: val.mobile,
            office: val.office,
            whatsapp: val.whatsapp,
          },
        };
        break;
      }
      case 'address': {
        const val = this.addressForm.value;
        payload = {
          addressLine: {
            line1: val.line1,
            line2: val.line2,
          },
        };
        break;
      }
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
