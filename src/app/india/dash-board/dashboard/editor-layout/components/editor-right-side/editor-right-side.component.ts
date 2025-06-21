import { DEFAULT_RESIZE_TIME } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DefaultTemplateComponent } from '../theme/theme/templates/default-template/default-template.component';
import { ClassicTemplateComponent } from '../theme/theme/templates/classic-template/classic-template.component';

@Component({
  selector: 'app-editor-right-side',
  standalone: true,
  imports: [CommonModule, DefaultTemplateComponent, ClassicTemplateComponent],
  templateUrl: './editor-right-side.component.html',
  styleUrl: './editor-right-side.component.css',
})
export class EditorRightSideComponent {
  @Input() selectedTemplate: string = 'default';
}
