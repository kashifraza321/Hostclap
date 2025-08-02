import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './editor-sidebar.component.html',
  styleUrl: './editor-sidebar.component.css',
})
export class EditorSidebarComponent {
  constructor(private router: Router) {}
  @Output() menuClick = new EventEmitter<string>();

  menuClicked(menu: string) {
    console.log('Sidebar clicked:', menu);

    this.menuClick.emit(menu);
  }
  goToPages() {
    console.log('clicked pages');

    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  goToTheme() {
    console.log('clicked pages');

    this.router.navigateByUrl('/in/insight/editor/theme');
  }
}
