import { Component } from '@angular/core';
import { EditorLayoutComponent } from '../../editor-layout/editor-layout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css',
})
export class ThemeComponent {
  constructor(private parent: EditorLayoutComponent) {}
  selectedTemplate: string = 'default';
  selectTemplate(template: string) {
    console.log('ThemeComponent: selected template =', template);
    this.parent.selectedTemplate = template;
    console.log(
      'ThemeComponent: parent selectedTemplate =',
      this.parent.selectedTemplate
    );
  }
  goBack() {
    this.parent.backToSidebar();
  }
  colorOptions = [
    { gradient: 'linear-gradient(to right, orange 50%, deepskyblue 50%)' },
    { gradient: 'linear-gradient(to right, lightcoral 50%, skyblue 50%)' },
    { gradient: 'linear-gradient(to right, purple 50%, green 50%)' },
    { gradient: 'linear-gradient(to right, dodgerblue 50%, aqua 50%)' },
    { gradient: 'linear-gradient(to right, goldenrod 50%, khaki 50%)' },
    { gradient: 'linear-gradient(to right, teal 50%, maroon 50%)' },
    { gradient: 'linear-gradient(to right, mediumorchid 50%, hotpink 50%)' },
    { gradient: 'linear-gradient(to right, royalblue 50%, white 50%)' },
    { gradient: 'linear-gradient(to right, brown 50%, darkred 50%)' },
    { gradient: 'linear-gradient(to right, black 50%, darkgray 50%)' },
  ];

  selectColor(color: any) {
    console.log('Selected color:', color);
    // handle color selection
  }

  restoreColors() {
    console.log('Restore to original colors.');
    // handle restore logic
  }
}
