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
  userId: string = '';
  constructor(private router: Router) {}
  @Output() menuClick = new EventEmitter<string>();
  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
  }

  menuClicked(menu: string) {
    this.menuClick.emit(menu);
  }

  goToPages() {
    this.router.navigate(['/in/insight/editor/pages']);
  }
  goToTheme() {

    this.router.navigateByUrl('/in/insight/editor/theme');
  }
  goToSections() {
    console.log('clicked pages');

    this.router.navigateByUrl('/in/insight/editor/sections');
  }
  goToSetting() {
    console.log('clicked pages');

    this.router.navigateByUrl('/in/insight/editor/settings');
  }
}
