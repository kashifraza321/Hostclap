import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PagesService } from 'src/app/pages/pages.service';
import { ThemeService } from '../../../theme.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Data } from 'src/app/models/data.model';


declare var $: any;
@Component({
  selector: 'app-testimonial-slider',
  standalone: true,
  imports: [CommonModule,SlickCarouselModule],
  templateUrl: './testimonial-slider.component.html',
  styleUrl: './testimonial-slider.component.css'
  
})
export class TestimonialSliderComponent   {
   @Input() pageId!: string;
     preview: any = {};
     @Input() data!: Data;
    pageData: any;
  testimonials: any[] = [];
  testimonialGroups: any[] = [];
   @Input() isMobilePreview = false;
    imgurl = environment.imageBaseUrl;
public state$ = this.pagesService.state$;
  testimonialConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  dummyTestimonials = [
  {
    name: 'John Doe',
    review: 'This company exceeded my expectations. Excellent service!',
    date: '01/01/2023',
    rating: 5,
    image: 'assets/images/dummy-user-1.jpg'
  },
  {
    name: 'Jane Smith',
    review: 'Great experience from start to finish. Highly recommend.',
    date: '15/02/2023',
    rating: 4,
    image: 'assets/images/dummy-user-2.jpg'
  },
  {
    name: 'Michael Johnson',
    review: 'Professional, reliable, and friendly team!',
    date: '10/03/2023',
    rating: 5,
    image: 'assets/images/dummy-user-3.jpg'
  }
];

  constructor(  private pagesService: PagesService,
      private route: ActivatedRoute,
      private sanitizer: DomSanitizer,
      private cdr: ChangeDetectorRef,
      private themeService: ThemeService){

  }
   ngOnInit() {
   this.GetWebsiteTheme() 
    
    this.getSectionDetailDataForTestimonials(this.pageId);
      this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
    });
   
  }
   ngOnChanges(changes: SimpleChanges) {
      if (changes['data'] && changes['data'].currentValue) {
        this.data = { ...this.data, ...changes['data'].currentValue };
  
        console.log('Data updated in ModernTemplate:', this.data);
  
       
        if (this.data.selectedColor) {
          this.preview = {
            ...this.preview,
  
            selectedColor: this.data.selectedColor,
          };
        }
      }
    }

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
  getSectionDetailDataForTestimonials(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'testimonials').subscribe({
      next: (res) => {
        const groups = res.data?.section?.groups || [];

        this.testimonialGroups = groups.map((group: any) => {
          // Build full image URL safely
          let imageUrlSafe = null;
          if (group.testimonial?.imageUrl) {
            const baseUrl = this.imgurl.endsWith('/') ? this.imgurl : this.imgurl + '/';
            imageUrlSafe = this.sanitizer.bypassSecurityTrustUrl(baseUrl + group.testimonial.imageUrl);
          }

          return {
            name: group.testimonial?.reviewerName,
            review: group.testimonial?.quote,
            date: new Date(group.testimonial?.date).toLocaleDateString(),
            rating: Number(group.testimonial?.rating) || 0,
            image: imageUrlSafe
          };
        });

        
        // this.testimonials = this.testimonialGroups;

      
        // ✅ Fallback to dummy if no testimonials found
      if (this.testimonialGroups.length === 0) {
        this.testimonials = this.dummyTestimonials;
      } else {
        this.testimonials = this.testimonialGroups;
      }
        this.cdr.detectChanges();
      },
      error: (err) => {
      console.error('Error loading section detail', err);
      // ✅ In case of API failure, also fallback
      this.testimonials = this.dummyTestimonials;
      this.cdr.detectChanges();
    }
    });
  }
}






