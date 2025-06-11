import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorLayoutComponent } from './components/editor-layout/editor-layout.component';
import { EditorSidebarComponent } from './components/editor-sidebar/editor-sidebar.component';

const routes: Routes = [{ path: '', component: EditorSidebarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorLayoutRoutingModule {}
