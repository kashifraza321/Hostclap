import { DEFAULT_RESIZE_TIME } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DefaultTemplateComponent } from '../theme/theme/templates/default-template/default-template.component';
import { ClassicTemplateComponent } from '../theme/theme/templates/classic-template/classic-template.component';
import { Data } from 'src/app/models/data.model';
import { ThemeService } from '../theme/theme/theme.service';
import { ModernTemplateComponent } from '../theme/theme/templates/modern-template/modern-template.component';
import { SubgroupDetailComponent } from '../theme/theme/templates/subgroup-detail/subgroup-detail.component';

@Component({
  selector: 'app-editor-right-side',
  standalone: true,
  imports: [
    CommonModule,
    DefaultTemplateComponent,
    ClassicTemplateComponent,
    ModernTemplateComponent,
    SubgroupDetailComponent
  ],
  templateUrl: './editor-right-side.component.html',
  styleUrl: './editor-right-side.component.css',
})
export class EditorRightSideComponent {
  constructor(private themeService: ThemeService) {}
  // @Input() template: string = 'default';
  @Input() data!: Data;
  pageId:string=''
    slug = '';
    
  isMobilePreview = false;
@Output() previewClicked = new EventEmitter<void>();
 showSubGroup = false; 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('EditorRightSideComponent received data:', this.data);
    }
  }
  ngOnInit() {
    this.GetWebsiteTheme();
    console.log(this.data, 'theme datahhhhhhhhhhhhhhh');
  }
  // GetWebsiteTheme() {
  //   this.themeService.getTheme().subscribe({
  //     next: (response) => {
  //       this.data = response.data;
  //       console.log(this.data, 'dataaaaaaaaaaaa');
  //       console.log('get themeee', response);
  //     },
  //   });
  // }
  // GetWebsiteTheme() {
  //   this.themeService.getTheme().subscribe({
  //     next: (response) => {
  //       // Only update specific properties like selectedColor
  //       if (response.data?.selectedColor) {
  //         this.data.selectedColor = response.data.selectedColor;
  //         console.log('Updated selectedColor:', this.data.selectedColor);
  //       }
  //       console.log('Updated data from API:', this.data);
  //     },
  //   });
  // }


toggleMobilePreview() {
  this.isMobilePreview = !this.isMobilePreview;
}
  onOpenSubGroup() {
    
    this.showSubGroup = true; 
  }
  handleOpenSubGroup(event: { slug: string; pageId: string }) {
     console.log('Received from child:', event); 
    this.slug = event.slug;
    this.pageId = event.pageId;
    this.showSubGroup = true;
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
}
