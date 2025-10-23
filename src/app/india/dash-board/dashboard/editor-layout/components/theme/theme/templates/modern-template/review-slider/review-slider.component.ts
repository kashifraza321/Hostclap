import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
// import { Data } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';
import { ThemeService } from '../../../theme.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-review-slider',
  standalone: true,
  imports: [CommonModule,CarouselModule],
  templateUrl: './review-slider.component.html',
  styleUrl: './review-slider.component.css',
})
export class ReviewSliderComponent {
  private sliderWidth: number = window.innerWidth;
  private animationSpeed: number = 1000;
  private pauseTime: number = 2000;
  private currentSlide: number = 1;

  private $slider: JQuery<HTMLElement> = $("#slider");
  private $slideWrapper: JQuery<HTMLElement> = $(".slides", this.$slider);
  private $allSlides: JQuery<HTMLElement> = $(".slide", this.$slider);




  private interval!: number;
  currentIndex = 0;
  @Input() data!: Data;
  pageData: any;
   @Input() pageId!: string;
     preview: any = {};
    public state$ = this.pagesService.state$;
  isLoading = false;

  userId: string = '';
  autoplayInterval: any;
  slideWidthPercentage = 100;
modernSlides = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Sunset Over Mountains',
    text: 'A breathtaking view with warm colors and peace.',
  },
  {
    image: 'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=800&q=80',
    title: 'Forest Pathway',
    text: 'Walk through nature and feel the calmness of life.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    title: 'City Skyline',
    text: 'The urban beauty that never sleeps.',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    title: 'Ocean Waves',
    text: 'Feel the rhythm of the sea and the breeze.',
  },
];
    modernIndex = 0;
   modernInterval!: number;




//  customOptions: any = {
//   loop: true,
//   margin: 10,
//   nav: true,
//   dots: false,
//   responsive: {
//     0: {
//       items: 1
//     },
//     600: {
//       items: 2
//     },
//     1000: {
//       items: 3
//     }
//   }
// };


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
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
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
  
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {
    
  }
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    console.log('ngOnInit - data received:', this.data);
     this.setSlideWidth(); // 🆕 Set initial slide width
  window.addEventListener('resize', this.setSlideWidth.bind(this));
this.autoplayInterval = setInterval(() => {
  this.next();
}, 3000); // autoplay every 3 seconds
 
  console.log('BrideGalleryComponent loaded ✅');
    // console.log('Images array:', this.images);
    console.log('User ID:', this.userId);
    this.GetWebsiteTheme();
  this.pagesService.state$.subscribe((state) => {
        console.log('Realtime state in ModernTemplate:', state);
      this.preview = state.preview;
     
   
    });
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
    // this.pagesService.state$.subscribe((state) => {
    //   this.preview = state.preview;
    // });
    // this.getPages();
  }
    ngAfterViewInit(): void {
    this.startModernSlider();
  }

  ngOnDestroy() {
  if (this.autoplayInterval) {
    clearInterval(this.autoplayInterval);
  }
   window.removeEventListener('resize', this.setSlideWidth.bind(this)); 
}


next() {
  const visibleSlides = 100 / this.slideWidthPercentage;
  const maxIndex = Math.ceil(this.reviews.length - visibleSlides);

  if (this.currentIndex < maxIndex) {
    this.currentIndex++;
  } else {
    this.currentIndex = 0;
  }
}


prev() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  }
}
  setSlideWidth() {
  const width = window.innerWidth;

  if (width >= 1024) {
    this.slideWidthPercentage = 33.33; // 3 per row
  } else if (width >= 600) {
    this.slideWidthPercentage = 50; // 2 per row
  } else {
    this.slideWidthPercentage = 100; // 1 per row
  }
}


startModernSlider(): void {
  this.stopModernSlider();
  this.modernInterval = window.setInterval(() => {
    this.nextModernSlide();
  }, 3000);
}

stopModernSlider(): void {
  if (this.modernInterval) clearInterval(this.modernInterval);
}

nextModernSlide(): void {
  this.modernIndex = (this.modernIndex + 1) % this.modernSlides.length;
}

prevModernSlide(): void {
  this.modernIndex =
    (this.modernIndex - 1 + this.modernSlides.length) %
    this.modernSlides.length;
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
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log(this.pageData.contactUs.title, 'mobileeeee');

        console.log('Page Detail:', res);
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
        this.isLoading = false;
      },
    });
  }
}
