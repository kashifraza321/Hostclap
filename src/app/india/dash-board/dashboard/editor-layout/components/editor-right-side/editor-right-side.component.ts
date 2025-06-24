import { DEFAULT_RESIZE_TIME } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DefaultTemplateComponent } from '../theme/theme/templates/default-template/default-template.component';
import { ClassicTemplateComponent } from '../theme/theme/templates/classic-template/classic-template.component';
import { Data } from 'src/app/models/data.model';
import { ThemeService } from '../theme/theme/theme.service';

@Component({
  selector: 'app-editor-right-side',
  standalone: true,
  imports: [CommonModule, DefaultTemplateComponent, ClassicTemplateComponent],
  templateUrl: './editor-right-side.component.html',
  styleUrl: './editor-right-side.component.css',
})
export class EditorRightSideComponent {
  constructor(private themeService: ThemeService) {}
  // @Input() selectedTemplate: string = 'default';
  @Input() data!: Data;
  ngOnInit() {
    this.GetWebsiteTheme();
  }
  GetWebsiteTheme() {
    this.themeService.getTheme().subscribe({
      next: (response) => {
        console.log('get themeee', response);
      },
    });
  }
}
