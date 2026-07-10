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
    console.log('Sidebar loaded with userId:', this.userId);
  }

  menuClicked(menu: string) {
    console.log('Sidebar clicked:', menu);

    this.menuClick.emit(menu);
  }

  goToPages() {
    console.log('User ID being sent:', this.userId);
    this.router.navigate(['/in/insight/editor/pages']);
  }
  goToTheme() {
    console.log('clicked pages');

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
