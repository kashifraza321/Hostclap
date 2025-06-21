import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-editor-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './editor-sidebar.component.html',
  styleUrl: './editor-sidebar.component.css',
})
export class EditorSidebarComponent {
  @Output() menuClick = new EventEmitter<string>();

  menuClicked(menu: string) {
    console.log('Sidebar clicked:', menu);

    this.menuClick.emit(menu);
  }
}
