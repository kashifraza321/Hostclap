import { Component } from '@angular/core';
import { EditorLayoutComponent } from '../../editor-layout/editor-layout.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { Data } from 'src/app/models/data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css',
})
export class ThemeComponent {
  constructor(
    private themeService: ThemeService,
    private parent: EditorLayoutComponent,
    private router: Router
  ) {}
  ngOnInIt() {
    // this.GetWebsiteTheme();
  }
  template: string = 'Origins';

  selectTemplate(template: string) {
    console.log('ThemeComponent: selected template =', template);
    this.parent.updateData({ template: template });
  }

  selectColor(color: any) {
    this.parent.updateData({ selectedColor: color });
  }
  goBack() {
    this.router.navigateByUrl('/in/insight/editor');
  }

  colorOptions = [
    {
      primary: '#9C27B0', // Purple
      secondary: '#E91E63', // Pink
    },
    {
      primary: '#2196F3', // Blue
      secondary: '#03A9F4', // Light Blue
    },
    {
      primary: '#FF9800', // Orange
      secondary: '#FFEB3B', // Yellow
    },
    // ...add as many as you like
  ];

  restoreColors() {
    console.log('Restore to original colors.');
    // handle restore logic
  }
  fonts = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Poppins',
    'Montserrat',
    'Raleway',
    'Ubuntu',
    'Oswald',
    'Quicksand',
    'Merriweather',
    'Nunito',
    'PT Sans',
    'Arimo',
    'Karla',
    'Rubik',
    'Fira Sans',
    'Work Sans',
    'Cabin',
    'Mukta',
    'Hind',
  ];
  selectFont(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    console.log('Selected font:', value);
    this.parent.updateData({ font: value });
  }

  saveTheme() {
    const themeData: Data = this.parent.data;
    console.log('Saving theme data:', themeData);
    this.themeService.saveTheme(themeData).subscribe({
      next: (response) => {
        console.log('Theme saved successfully:', response);
        alert('Theme saved successfully!');
      },
      error: (error) => {
        console.error('Error saving theme:', error);
        alert('Error while saving theme!');
      },
    });
  }
}
