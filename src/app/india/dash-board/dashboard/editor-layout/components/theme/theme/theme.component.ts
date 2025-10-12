import { ChangeDetectorRef, Component } from '@angular/core';
import { EditorLayoutComponent } from '../../editor-layout/editor-layout.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { Data } from 'src/app/models/data.model';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorChromeModule } from 'ngx-color/chrome';




@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ColorPickerModule,ColorChromeModule ],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css',
})
export class ThemeComponent {
  themeForm: FormGroup;
    showCustomColors = false;

  colorOptions = [
    { primary: '#e92984e6', secondary: '#e6e6e6', accent: '#f9eee9' },
    { primary: '#29B6F6', secondary: '#ff827c', accent: '#ededed' },
    { primary: '#3336A3', secondary: '#F2F4F7', accent: '#ffffff' },
    { primary: '#ffbe33', secondary: '#212529', accent: '#f8f9fa' },
    { primary: '#baddf3', secondary: '#f3baba', accent: '#333333' },
    { primary: '#ffa826', secondary: '#5f2b65', accent: '#ffffff' },
    { primary: '#c81a35', secondary: '#faeee9', accent: '#ffffff' },
  ];
   selectedType: 'primary' | 'secondary' | 'accent' = 'primary';
  
  colors = {
    primary: '#9C27B0',
    secondary: '#E91E63',
    accent: '#f8f2f1'
  };

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

  get selectedColor() {
    return this.colors[this.selectedType];
  }

onColorChange(color: string) {
    // Update local color object
    this.colors[this.selectedType] = color;

    // Sync with form
    this.themeForm.patchValue({
      [this.selectedType]: color
    }, { emitEvent: false });

    // Update parent data so the right side reflects
    this.updateParentData();
}


  selectType(type: 'primary' | 'secondary' | 'accent') {
    this.selectedType = type;
  }

  

  selectTemplate(template: string) {
    this.themeForm.patchValue({ template });
  }
   toggleCustomColor(event: any) {
    this.showCustomColors = event.target.checked;

    if (this.showCustomColors) {
      // Sync colors object with form values when opening picker
      this.colors = {
        primary: this.themeForm.value.primary,
        secondary: this.themeForm.value.secondary,
        accent: this.themeForm.value.accent,
      };
    }
  }

   applyPresetColors(color: any) {
    // Update form
    this.themeForm.patchValue({
      primary: color.primary,
      secondary: color.secondary,
      accent: color.accent,
    });

    // Sync picker colors
    this.colors = {
      primary: color.primary,
      secondary: color.secondary,
      accent: color.accent,
    };

    // Reset picker to show Primary first
    this.selectedType = 'primary';
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
  onColorInput(event: any, color: 'primary' | 'secondary' | 'accent') {
    const colorValue = (event.target as HTMLInputElement).value;
    this.themeForm.patchValue({
      [color]: colorValue, // Dynamically update the selected color
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
