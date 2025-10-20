import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { PagesService } from 'src/app/pages/pages.service';
import { ColorUtilsService } from 'src/app/services/color-utils.service';
import { Data } from 'src/app/models/data.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { LoaderComponent } from 'src/app/commonComponent/loader/loader.component';
import { ReviewSliderComponent } from './review-slider/review-slider.component';
import { AboutUsSliderComponent } from './about-us-slider/about-us-slider.component';
import { ThemeService } from '../../theme.service';
import { TestimonialSliderComponent } from './testimonial-slider/testimonial-slider.component';
import { filter, take } from 'rxjs';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { SwiperModule } from 'swiper/angular';
interface TeamMember {
  name: string;
  role: string;
  img: string;
}
@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ReviewSliderComponent,
    AboutUsSliderComponent,
    TestimonialSliderComponent,
    RouterModule 
  ],
  templateUrl: './modern-template.component.html',
  styleUrl: './modern-template.component.css',
})
export class ModernTemplateComponent {
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
  slug:string=''
  showSubGroupRoute = false;

  itemsToShow = 3;
  selectedGroupIndex: number = 0;
  abovePriceContactSections: any[] = [];
  subgroupsToShowForPrice: any[] = [];
  selectedPriceGroupIndex = 0;
  teamImages: string[] = [];
  currentindex = 0;
  itemsPerView = 3;
  teamMembers: { img: string; name: string; role: string }[] = [];
  testimonials: any[] = [];
  currentIndex = 0;
  isAnimating = false;
  reviews = [
    {
      text: 'Huge shoutout to Zoe and team, for making me feel so beautiful 💖 ...',
      date: 'Jul 2, 2025',
      rating: 5,
      name: 'Sis Tee',
      initial: 'S',
    },
    {
      text: 'Thnkyou soo soo much Zoe for the amazing makeup for my nikah...',
      date: 'Jun 26, 2025',
      rating: 5,
      name: 'Arshi Saniya',
      initial: 'A',
    },
    {
      text: 'Loved the experience with Aziza and the team...',
      date: 'May 20, 2025',
      rating: 5,
      name: 'Avni Mohan',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
  ];

  currentTestimonialIndex = 0;
  testimonialsPerView = 3;
 currentDay: string;
  isTestimonialAnimating = false;
    scrollListenerAttached = false;
 @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
   @Output() openSubGroup = new EventEmitter<{ slug: string; pageId: string }>();
   openingHoursData: any[] = [];
isMobileMenuOpen = false;


isScrolled = false;
  


  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
     private router: Router,
    private themeService: ThemeService,
    public colorUtils: ColorUtilsService
  ) {
     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     
    const today = new Date().getDay(); // Get the current day (0-6)
    this.currentDay = daysOfWeek[today];
    
  }
 

  ngOnInit() {
  this.userId = this.route.snapshot.paramMap.get('id') || '';
  console.log('User ID:', this.userId);
  console.log('ngOnInit - data received:', this.data);
 
  console.log('User ID:', this.userId);
  console.log('Page ID:', this.pageId);
  this.updateCarousel(0);
  this.GetWebsiteTheme();
 
    /////////////////////////////////////////////////
    this.pagesService.state$.subscribe((state) => {
        console.log('Realtime state in ModernTemplate:', state);
      this.preview = state.preview;
      this.pagesList = state.pages;
     this.serviceData = state.preview.services 
      ? Object.values(state.preview.services) 
      : [];
      
    });


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Check if 'subgroup' outlet exists in the current route
      const currentTree = this.router.parseUrl(this.router.url);
      this.showSubGroupRoute = currentTree.root.children['subgroup'] !== undefined;
    });
  
    this.getPages();
    this.updateTestimonialsPerView();
    // window.addEventListener('resize', () => this.updateTestimonialsPerView());

 
  }
     isToday(day: string): boolean {
    return day === this.currentDay; 
  }
  ngOnChanges(changes: SimpleChanges) {
    
 
    if (changes['data'] && changes['data'].currentValue) {
      this.data = { ...this.data, ...changes['data'].currentValue };

      console.log('Data updated in ModernTemplate:', this.data);


      
      const newPrimary = this.data?.selectedColor?.secondary;
      if (newPrimary) {
        const isDark = this.colorUtils.isColorDark(newPrimary);
        console.log(`isColorDark('${newPrimary}'):`, isDark);
        document.body.setAttribute('theme', isDark ? 'dark' : 'light');
      }

     
      if (this.data.selectedColor) {
        this.preview = {
          ...this.preview,
          selectedColor: this.data.selectedColor,
        };
      }
    }
  }

ngAfterViewInit() {
 
}
  navigateToContact(pageId: string,slug:string) {
    this.router.navigate(['/in/insight/editor/service-detail', pageId]);
  }

  ngAfterViewChecked() {
    if (this.scrollContainer && !this.scrollListenerAttached) {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      this.scrollListenerAttached = true;
    
    }
  }
   onScroll(event?: Event) {
   
    // Example: toggle isScrolled based on scrollTop
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this.isScrolled = scrollTop > 50;
    this.cdr.detectChanges(); // ensure Angular picks up the change
  }
  onOpenSubGroupClick(slug: string, pageId: string) {
    this.openSubGroup.emit({ slug, pageId });
  }

  // navigateToDetail(slug:string ) {
  // this.router.navigate([{ outlets: { subgroup: ['service-detail', slug] } }]);

  //   // this.router.navigate(['/in/insight/editor/service-detail', slug]);
  // }
  
  navigateToDetail(slug: string) {
 console.log({
  outlets: {
    subgroup: ['in/insight/editor/service-detail', slug]
  }
});
this.router.navigate([
  '/in/insight/editor',
  {
    outlets: {
      subgroup: ['service-detail', slug]
    }
  }
]);

}
toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}


  updateData(update: Partial<Data>) {
    this.data = { ...this.data, ...update };
    console.log('Updated Data:', this.data);
  }
  // slider
  testimonialCurrentIndex = 0;

  testimonialNext() {
    if (this.testimonialCurrentIndex < this.testimonialGroups.length - 3) {
      this.testimonialCurrentIndex++;
    }
  }

  testimonialPrev() {
    if (this.testimonialCurrentIndex > 0) {
      this.testimonialCurrentIndex--;
    }
  }

  updateTestimonialsPerView() {
    if (window.innerWidth < 600) this.testimonialsPerView = 1;
    else if (window.innerWidth < 900) this.testimonialsPerView = 2;
    else this.testimonialsPerView = 3;
  }
  // testimonial

  updateCarousel(newIndex: number): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const length = this.teamImages.length;
    this.currentIndex = (newIndex + length) % length;

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  prev(): void {
    this.updateCarousel(this.currentIndex - 1);
  }

  // Move to the next image
  next(): void {
    this.updateCarousel(this.currentIndex + 1);
  }
  selectIndex(index: number): void {
    this.currentIndex = index;
  }

  // slider
  GetWebsiteTheme() {
    this.themeService.getTheme().subscribe({
      next: (response) => {
        if (response.data) {
          this.data = {
            ...this.data,
            ...response.data,
          };
          console.log('Merged theme data:', this.data);
        }
      },
      error: (err) => {
        console.error('Error fetching theme:', err);
      },
    });
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
          this.getSectionDetailDataForOpening(this.pageId);
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
        if (this.pageData?.gallery?.images?.length) {
          this.teamImages = this.pageData.gallery.images;
          console.log('Gallery Images:', this.teamImages);
          this.updateCarousel(0);
        }
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
  amenityIcons: { [key: string]: string } = {
    'Free consultation': 'assets/images/icons8-star-48.png',
    'Wheelchair accessible': 'assets/images/icons8-wheelchair-50.png',
    '24/7 availability': 'assets/images/icons8-clock-48.png',
    'Advance booking': 'assets/images/icons8-star-48.png',
    'Get Free Quotation': 'assets/icons/quotation.png',
    'Wifi on the premises': 'assets/images/icons8-wifi-24.png',
  };
  getAmenityIcon(name: string): string {
    return this.amenityIcons[name] || 'assets/icons/default.png';
  }
  getLogoUrl(): SafeUrl {
    // console.log(this.pageData?.header?.logo?.image, 'logooooooo img');

    if (
      (this.preview?.logo?.image &&
        typeof this.pageData?.header?.logo?.image === 'object') ||
      typeof this.preview?.logo?.image === 'string'
    ) {
      return this.sanitizer.bypassSecurityTrustUrl(this.preview.logo.image);
    }

    if (this.pageData?.header?.logo?.image) {
      return this.sanitizer.bypassSecurityTrustUrl(
        this.imgurl + this.pageData.header.logo.image
      );
    }

    return 'assets/images/default-logo.png';
  }

getCoverUrl(): SafeStyle {
  // If preview has a cover image (either as an object or string)
  if (
    (this.preview?.cover?.image && typeof this.pageData?.cover?.image === 'object') ||
    typeof this.preview?.cover?.image === 'string'
  ) {
    return this.sanitizer.bypassSecurityTrustStyle(
      `url("${this.preview.cover.image}")`
    );
  }

  // If pageData has a cover image
  if (this.pageData?.header?.cover?.image) {
    return this.sanitizer.bypassSecurityTrustStyle(
      `url("${this.imgurl + this.pageData.header.cover.image}")`
    );
  }

  // Fallback default cover image
  return this.sanitizer.bypassSecurityTrustStyle(
    `url("assets/images/bg2.webp")`
  );
}

  // cover patch
  // getCoverUrl(state: any): SafeStyle {
  //   console.log(this.pageData?.header?.cover?.image, 'coverrr img');
  //   if (state?.preview?.cover?.image) {
  //     return this.sanitizer.bypassSecurityTrustStyle(
  //       `url("${state.preview.cover.image}")`
  //     );
  //   }

  //   if (state?.pageData?.header?.cover?.image) {
  //     return this.sanitizer.bypassSecurityTrustStyle(
  //       `url("${this.imgurl + state.pageData.header.cover.image}")`
  //     );
  //   }

  //   return this.sanitizer.bypassSecurityTrustStyle(
  //     `url("assets/images/bg2.webp")`
  //   );
  // }

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


  onRequestService(sub: any) {
  if (sub.bookingOption === 'ThirdParty' && sub.bookingUrl) {
    window.open(sub.bookingUrl, '_blank');
    return;
  }}
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

  setSelectedGroup(index: number, type: 'service' | 'price_list') {
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

  setSelectedPriceGroup(index: number) {
    if (index >= 0 && index < this.abovePriceContactSections.length) {
      this.selectedPriceGroupIndex = index;
    }
  }
  // slider
  // opening hours
      getSectionDetailDataForOpening(pageId:string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'opening_hours').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
               this.openingHoursData = res.data.section.openingHours || [];

        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
getOpeningHours(day: string): string {
  const dayInfo = this.openingHoursData.find(d => d.day === day);
  if (!dayInfo || !dayInfo.isOpen) return 'Closed';

  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

  const openTime = new Date(`1970-01-01T${dayInfo.openTime || '00:00'}:00`).toLocaleTimeString([], options);
  const closeTime = new Date(`1970-01-01T${dayInfo.closeTime || '00:00'}:00`).toLocaleTimeString([], options);

  return `${openTime} - ${closeTime}`;
}


}
