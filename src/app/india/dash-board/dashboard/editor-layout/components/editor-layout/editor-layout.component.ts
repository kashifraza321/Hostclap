import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';
import { EditorSidebarComponent } from '../editor-sidebar/editor-sidebar.component';
import { EditorRightSideComponent } from '../editor-right-side/editor-right-side.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeComponent } from '../theme/theme/theme.component';
import { Data } from 'src/app/models/data.model';
import { PagesComponent } from 'src/app/pages/pages.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';

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
export class EditorLayoutComponent {
  template: string = 'default';
  showSidebar = true;
  currentComponent: any = null;
  data: Data = {
    template: 'default',
    font: 'Roboto',
    selectedColor: null,
  };
  updateData(newData: Partial<Data>) {
    this.data = { ...this.data, ...newData };
    console.log('EditorLayoutComponent updated data:', this.data);
  }
}
