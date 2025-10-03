import { ChangeDetectorRef, Component } from '@angular/core';
import { EditorLayoutComponent } from '../../editor-layout/editor-layout.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { Data } from 'src/app/models/data.model';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css',
})
export class ThemeComponent {
  themeForm: FormGroup;

  colorOptions = [
    { primary: '#e92984e6', secondary: '#e6e6e6', accent: '#f9eee9' },
    { primary: '#29B6F6', secondary: '#ff827c', accent: '#ededed' },
    { primary: '#294FDA', secondary: '#F6F8FC', accent: '#ededed' },
    { primary: '#ffbe33', secondary: '#212529', accent: '#f8f9fa' },
    { primary: '#baddf3', secondary: '#f3baba', accent: '#333333' },
    { primary: '#C36D5F', secondary: '#944232', accent: '#ededed' },
    { primary: '#915ED1', secondary: '#F96290', accent: '#ededed' },
  ];

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

  templates = ['Classic', 'Origins', 'Modern'];

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private parent: EditorLayoutComponent,
    private router: Router,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef
  ) {
    // Initialize form
    this.themeForm = this.fb.group({
      template: ['Origins'],
      font: ['Roboto'],
      primary: ['#9C27B0'],
      secondary: ['#E91E63'],
      accent: [''],
    });

    // Watch form changes to update parent data
    this.themeForm.valueChanges.subscribe((val) => {
      this.updateParentData();
    });
  }

  ngOnInit(): void {
    // Optionally load existing theme
    // this.GetWebsiteTheme();
  }

  selectTemplate(template: string) {
    this.themeForm.patchValue({ template });
  }

  applyPresetColors(color: any) {
    this.themeForm.patchValue({
      primary: color.primary,
      secondary: color.secondary,
      accent: color.accent,
    });
  }
  selectFont(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.themeForm.patchValue({ font: value });
  }
  selectColor(color: any) {
    this.themeForm.patchValue({
      primary: color.primary,
      secondary: color.secondary,
      accent: color.accent,
    });
  }

  updateParentData() {
    const { template, font, primary, secondary, accent } = this.themeForm.value;

    this.parent.updateData({
      template,
      font,
      selectedColor: {
        primary,
        secondary,
        accent,
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/in/insight/editor');
  }

  saveTheme() {
    this.updateParentData();
    const themeData: Data = this.parent.data;

    this.themeService.saveTheme(themeData).subscribe({
      next: (response) => {
        console.log('Theme saved successfully:', response);
        this.alertService.success('Theme saved successfully');
      },
      error: (error) => {
        console.error('Error saving theme:', error);
        this.alertService.error('Error while saving theme');
      },
    });
  }
  // constructor(
  //   private themeService: ThemeService,
  //   private parent: EditorLayoutComponent,
  //   private router: Router,
  //   private alertService: AlertService,
  //   private cdRef: ChangeDetectorRef
  // ) {}
  // ngOnInIt() {
  //   // this.GetWebsiteTheme();
  // }
  // template: string = 'Origins';

  // selectTemplate(template: string) {
  //   console.log('ThemeComponent: selected template =', template);
  //   this.parent.updateData({ template: template });
  // }

  // // selectColor(color: any) {
  // //   console.log('Selected color:', color);
  // //   this.parent.updateData({
  // //     selectedColor: color,
  // //     template: this.parent.data.template,
  // //   });
  // // }
  // selectColor(color: any) {
  //   console.log('Selected color:', color);
  //   this.parent.updateData({
  //     selectedColor: {
  //       primary: color.primary,
  //       secondary: color.secondary,
  //       accent: color.accent,
  //     },
  //     template: this.parent.data.template || 'Modern',
  //   });
  // }

  // goBack() {
  //   this.router.navigateByUrl('/in/insight/editor');
  // }

  // colorOptions = [
  //   {
  //     primary: '#9C27B0',
  //     secondary: '#E91E63',
  //     accent: '#2196F3', // 👈 3rd color
  //   },
  //   {
  //     primary: '#2196F3',
  //     secondary: '#03A9F4',
  //     accent: '#8BC34A',
  //   },
  //   {
  //     primary: '#FF9800',
  //     secondary: '#FFEB3B',
  //     accent: '#4CAF50',
  //   },
  //   {
  //     primary: '#ffbe33',
  //     secondary: '#212529',
  //     accent: '#f8f9fa',
  //   },
  //   {
  //     primary: '#baddf3',
  //     secondary: '#f3baba',
  //     accent: '#333333',
  //   },
  //   {
  //     primary: '#477d02',
  //     secondary: '#fae367',
  //     accent: '#ff4081',
  //   },
  // ];

  // fonts = [
  //   'Roboto',
  //   'Open Sans',
  //   'Lato',
  //   'Poppins',
  //   'Montserrat',
  //   'Raleway',
  //   'Ubuntu',
  //   'Oswald',
  //   'Quicksand',
  //   'Merriweather',
  //   'Nunito',
  //   'PT Sans',
  //   'Arimo',
  //   'Karla',
  //   'Rubik',
  //   'Fira Sans',
  //   'Work Sans',
  //   'Cabin',
  //   'Mukta',
  //   'Hind',
  // ];
  // selectFont(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   const value = target.value;
  //   console.log('Selected font:', value);
  //   this.parent.updateData({ font: value });
  // }

  // saveTheme() {
  //   const themeData: Data = this.parent.data;
  //   console.log('Saving theme data:', themeData);
  //   this.themeService.saveTheme(themeData).subscribe({
  //     next: (response) => {
  //       console.log('Theme saved successfully:', response);
  //       // alert('Theme saved successfully!');
  //       this.alertService.success('Theme saved successfully');
  //     },
  //     error: (error) => {
  //       console.error('Error saving theme:', error);
  //       // alert('Error while saving theme!');
  //       this.alertService.error('Error while saving theme');
  //     },
  //   });
  // }
}
