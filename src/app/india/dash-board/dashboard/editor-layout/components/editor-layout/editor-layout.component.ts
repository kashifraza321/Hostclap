import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';
import { EditorSidebarComponent } from '../editor-sidebar/editor-sidebar.component';
import { EditorRightSideComponent } from '../editor-right-side/editor-right-side.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeComponent } from '../theme/theme/theme.component';
import { Data } from 'src/app/models/data.model';
import { PagesComponent } from 'src/app/pages/pages.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { ThemeService } from '../theme/theme/theme.service';

@Component({
  selector: 'app-editor-layout',
  standalone: true,
  imports: [
    CommonModule,
    EditorHeaderComponent,
    EditorSidebarComponent,
    EditorRightSideComponent,
    RouterOutlet,
  ],
  templateUrl: './editor-layout.component.html',
  styleUrl: './editor-layout.component.css',
})
export class EditorLayoutComponent implements OnInit, OnDestroy {
  template: string = 'default';
  showSidebar = true;
  currentComponent: any = null;
  isMobileView = false;
isSidebarOpen = false;
  data: Data = {
    template: '',
    font: '',
    selectedColor: null,

  };
    isPreview: boolean = false;

isMobilePreview = false;
  // Set true once the user makes any edit, so a slow initial theme load
  // cannot land late and overwrite a change the user already made.
  private userEdited = false;
  // Store the bound handler so it can actually be removed in ngOnDestroy
  // (a fresh .bind(this) each call produces a new reference that can't be removed).
  private onResize = this.checkScreenSize.bind(this);
  constructor(private themeService: ThemeService){

  }
  ngOnInit() {
  this.checkScreenSize();
  window.addEventListener('resize', this.onResize);
  this.loadInitialTheme();
}
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
  // Single source of truth: load the saved theme ONCE here and feed it to the
  // preview via @Input. Children must not fetch the theme themselves.
  private loadInitialTheme() {
    this.themeService.getTheme().subscribe({
      next: (response: any) => {
        if (!response?.data) return;
        if (this.userEdited) return; // don't clobber a change made meanwhile
        this.data = { ...this.data, ...response.data };
        if (!this.data.template) {
          this.data.template = 'Origins';
        }
      },
      error: (err) => console.error('Error loading theme:', err),
    });
  }
  // updateData(newData: Partial<Data>) {
  //   this.data = { ...this.data, ...newData };
  //   console.log('EditorLayoutComponent updated data:', this.data);
  // }
  updateData(newData: Partial<Data>) {
    this.userEdited = true; // a real edit has happened; protect it from late loads
    this.data = {
      ...this.data,
      ...newData,
    };

    if (!this.data.template) {
      this.data.template = 'Origins';
    }
  }

  // Merge a programmatically-loaded theme WITHOUT marking it as a user edit.
  // Children that fetch the theme to populate their own form must call this
  // (not updateData) so a background load can't trip the userEdited guard or
  // overwrite a change the user already made.
  applyLoadedTheme(newData: Partial<Data>) {
    if (this.userEdited) return;
    this.data = {
      ...this.data,
      ...newData,
    };
    if (!this.data.template) {
      this.data.template = 'Origins';
    }
  }
  checkScreenSize() {
  this.isMobileView = window.innerWidth <= 500;
  if (!this.isMobileView) {
    this.isSidebarOpen = false; // Sidebar always open on desktop
  }
}
setMobilePreview(status: boolean) {
  this.isMobilePreview = status;
}

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
enterPreview() {
  this.isPreview = true;
  console.log('Entered Preview Mode');
}

exitPreview() {
  this.isPreview = false;
  console.log('Exited Preview Mode');
}
}
