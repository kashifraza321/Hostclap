import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorLayoutComponent } from './components/editor-layout/editor-layout.component';
import { EditorSidebarComponent } from './components/editor-sidebar/editor-sidebar.component';
import { ThemeComponent } from './components/theme/theme/theme.component';

const routes: Routes = [
  {
    path: '',
    component: EditorLayoutComponent,
    children: [
      { path: 'theme', component: ThemeComponent },
      // { path: 'pages', component: PagesComponent },
      // { path: 'sections', component: SectionsComponent },
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
