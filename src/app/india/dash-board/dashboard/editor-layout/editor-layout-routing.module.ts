import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorLayoutComponent } from './components/editor-layout/editor-layout.component';
import { EditorSidebarComponent } from './components/editor-sidebar/editor-sidebar.component';
import { ThemeComponent } from './components/theme/theme/theme.component';
import { PagesComponent } from 'src/app/pages/pages.component';
import { TemplateHeaderComponent } from 'src/app/pages/template-header/template-header.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: EditorLayoutComponent,
    children: [
      {
        path: '',
        component: EditorSidebarComponent, // show sidebar by default
      },
      { path: 'theme', component: ThemeComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'home/:id', component: HomePageComponent },
      {
        path: 'header',
        component: TemplateHeaderComponent,
      },
      // { path: 'settings', component: SettingsComponent },
      // { path: '', redirectTo: 'theme', pathMatch: 'full' }, // optional default
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorLayoutRoutingModule {}
