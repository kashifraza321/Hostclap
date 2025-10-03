import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from 'src/app/commonComponent/loader/loader.component';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-classic-template',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './classic-template.component.html',
  styleUrl: './classic-template.component.css',
})
export class ClassicTemplateComponent {
  @Input() data!: Data;
  userId: string = '';
  pageId: string = '';
  pagesList: any[] = [];
  previewData: any = {};
  pages: any[] = [];
  preview: any = {};
  sectionId: string = '';
  pageData: any;
  imgurl = environment.imageBaseUrl;
  serviceData: any;
  serviceDataForPrice: any;
  allSubGroups: any[] = [];
  state: any;
  isLoading = false;
  visibleSubgroupsCount: number = 3;
  sanitizedLogoUrl: SafeUrl | null = null;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  testimonialGroups: any[] = [];
  imagePreviewSafeUrl: SafeUrl | null = null;
  public state$ = this.pagesService.state$;
  aboveContactSections: any[] = [];
  belowContactSections: any[] = [];
  isScrolled = false;
  itemsToShow = 3;
  selectedGroupIndex: number = 0;
  abovePriceContactSections: any[] = [];
  subgroupsToShowForPrice: any[] = [];
  selectedPriceGroupIndex = 0;
  aboveProductContactSections: any[] = [];
  // Initial settings
  selectedProductGroupIndex: number = 0;
  visibleProductsCount: number = 3;
  logoUrl!: SafeUrl;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   this.isScrolled = window.scrollY > 50;
  //   console.log('isScrolled:', this.isScrolled);
  // }
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);

    console.log('User ID:', this.userId);
    console.log('Page ID:', this.pageId);
    this.logoUrl = this.getLogoUrl();
    // this.pagesService.state$.subscribe((state) => {
    //   this.pages = state.pages;
    //   this.preview = state.preview;
    // });
    // this.pagesService.state$.subscribe((state) => {
    //   this.previewData = state.preview;
    // });
    // this.pagesService.state$.subscribe((state) => {
    //   console.log('preview data', state.preview.titles);
    // });
    // this.getPageDetail(pageID)
    this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
    });
    this.getPages();

    // this.getPageDetail('687177a9aa11a48cb4de77db');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
          const scrollTop = this.scrollContainer.nativeElement.scrollTop;
          this.isScrolled = scrollTop > 50;
          // console.log('Scroll:', scrollTop, 'isScrolled:', this.isScrolled);
        });
      } else {
        console.error('scrollContainer still not found after timeout!');
      }
    }, 0);
  }

  getPages() {
    this.isLoading = true;
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);

        this.pagesList = res.data || [];
        this.pageId = res.data[0]?._id;

        console.log(this.pageId, 'pageid yaha s nikal lun');

        console.log(this.pagesList, 'tazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        if (this.pageId) {
          this.getPageDetail(this.pageId);
          this.getSectionDetailData(this.pageId);
          this.getSectionDetailDataForPriceList(this.pageId);
          this.getSectionDetailDataForTestimonials(this.pageId);
          this.getSectionDetailDataForProducts(this.pageId);
          console.log(this.pageData.phones.mobile, 'mobileeeee');
          console.log(this.getSectionDetailData, 'gettttttttttt');
        }

        // this.data.pageData = this.pagesList;
        // this.parent.updateData({ pageData: this.pagesList });
        this.data = { ...this.data, pageData: this.pagesList };
        console.log(this.data.pageData, 'ffffffffffffffffffffff');
      },
      error: (err) => {
        console.error('Error loading pages:', err);
      },
      complete: () => {
        this.isLoading = false; // loader stop
      },
    });
  }

  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log(this.pageData.contactUs.title, 'mobileeeee');

        console.log('Page Detail:', res);
        console.log(this.pageData.phones.mobile, 'mobileeeee');
        // if (this.pageData?.header?.logo?.image) {
        //   this.sanitizedLogoUrl = this.sanitizer.bypassSecurityTrustUrl(
        //     this.imgurl + this.pageData.header.logo.image
        //   );
        // }
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
        this.isLoading = false;
      },
    });
  }
  getLogoUrl(): SafeUrl {
    if (this.preview?.logo?.image) {
      return this.sanitizer.bypassSecurityTrustUrl(this.preview.logo.image);
    }
    if (this.pageData?.header?.logo?.image) {
      return this.sanitizer.bypassSecurityTrustUrl(
        this.imgurl + this.pageData.header.logo.image
      );
    }
    return this.sanitizer.bypassSecurityTrustUrl(
      'https://ui-avatars.com/api/?name=Default+Logo&background=random'
    );
  }

  ngOnChanges(): void {
    this.logoUrl = this.getLogoUrl();
  }

  // cover patch
  getCoverUrl(state: any): SafeStyle {
    // console.log(this.pageData?.header?.cover?.image, 'coverrr img');
    if (state?.preview?.cover?.image) {
      return this.sanitizer.bypassSecurityTrustStyle(
        `url("${state.preview.cover.image}")`
      );
    }

    if (state?.pageData?.header?.cover?.image) {
      return this.sanitizer.bypassSecurityTrustStyle(
        `url("${this.imgurl + state.pageData.header.cover.image}")`
      );
    }

    return this.sanitizer.bypassSecurityTrustStyle(
      `url("assets/images/bg2.webp")`
    );
  }

  // cover

  getFullAddress(): string {
    const address = this.pageData?.contactUs?.address || '';
    const state = this.pageData?.contactUs?.state || '';
    const zip = this.pageData?.contactUs?.zip || '';
    const country = this.pageData?.contactUs?.country || '';
    return `${address}, ${state}, ${zip}, ${country}`;
  }

  getGoogleMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }
  getSectionDetailData(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'service').subscribe({
      next: (res) => {
        this.serviceData = res.data;
        console.log('Section detail:', res);
        this.aboveContactSections = res.data?.section?.groups || [];
        this.allSubGroups =
          res.data?.section?.groups?.flatMap((group: any) => group.subGroups) ||
          [];
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  getImageUrl(path: string | undefined): SafeUrl {
    if (!path) {
      return 'assets/images/bg2.webp';
    }
    const fullUrl = path.startsWith('http') ? path : `${this.imgurl}${path}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }
  loadMore(): void {
    this.visibleSubgroupsCount += 100;
  }
  // Gallery section
  getGalleryImageUrl(path: string | undefined): SafeUrl {
    if (!path) {
      return 'assets/images/gallery-placeholder.png';
    }
    const fullUrl = path.startsWith('http') ? path : `${this.imgurl}${path}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  getSectionDetailDataForPriceList(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'price_list').subscribe({
      next: (res) => {
        this.abovePriceContactSections = res.data?.section?.groups || [];
        this.setSelectedGroup(0, 'price_list');
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  setSelectedGroup(index: number, type: 'service' | 'price_list' | 'products') {
    if (type === 'price_list') {
      this.selectedPriceGroupIndex = index;
      this.subgroupsToShowForPrice =
        this.abovePriceContactSections[index]?.subgroups || [];
    }
  }
  getSectionDetailDataForTestimonials(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'testimonials').subscribe({
      next: (res) => {
        const groups = res.data?.section?.groups || [];

        this.testimonialGroups = groups.map((group: any) => {
          // Build full image URL safely
          if (group.testimonial?.imageUrl) {
            const baseUrl = this.imgurl.endsWith('/')
              ? this.imgurl
              : this.imgurl + '/';
            const fullUrl = baseUrl + group.testimonial.imageUrl;

            // Sanitize and replace imageUrl with SafeUrl
            group.testimonial.imageUrlSafe =
              this.sanitizer.bypassSecurityTrustUrl(fullUrl);
          } else {
            group.testimonial.imageUrlSafe = null;
          }

          return group;
        });
      },

      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  loadMoree(): void {
    this.visibleProductsCount += 3; // Increase count to show more products
  }

  // Method to set the selected group when clicked on "View Group"
  setproductSelectedGroup(index: number): void {
    this.selectedProductGroupIndex = index;
  }
  setPriceSelectedGroup(index: number): void {
    this.selectedProductGroupIndex = index;
  }

  // Fetching image URL and sanitizing the path
  getproductImageUrl(path: string | undefined): SafeUrl {
    if (!path) {
      return 'assets/images/default-image.png'; // Default placeholder if no media is provided
    }
    const fullUrl = path.startsWith('http') ? path : `assets/images/${path}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }
  // You might be fetching data like this (example)
  getSectionDetailDataForProducts(pageId: string) {
    console.log('Fetching product section details for page:', pageId);

    // Ensure this sectionType is 'products' for product data
    this.pagesService.GET_SECTION_DETAIL(pageId, 'products').subscribe({
      next: (res) => {
        console.log('API Response:', res);

        // Check the sectionType after fetching
        const sectionType = res.data?.section?.sectionType;
        console.log('Section Type from API:', sectionType);

        if (sectionType === 'products') {
          this.aboveProductContactSections = res.data?.section?.groups || [];
          console.log(
            'Updated Product Groups:',
            this.aboveProductContactSections
          );
        } else {
          console.error('Received incorrect section type:', sectionType);
        }
      },
      error: (err) => {
        console.error('Error loading section detail for products:', err);
      },
    });
  }
}
