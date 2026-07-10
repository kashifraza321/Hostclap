import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-editor-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-header.component.html',
  styleUrl: './editor-header.component.css'
})
export class EditorHeaderComponent {
  @Input() isPreview: boolean = false;
  @Output() previewClicked = new EventEmitter<void>();
  @Output() backToEditor = new EventEmitter<void>();
  @Output() mobilePreviewClicked = new EventEmitter<boolean>();
constructor(){}

  onMobileClick() {
    this.mobilePreviewClicked.emit(true);
  }
   onDesktopClick() {
    this.mobilePreviewClicked.emit(false); // back to desktop view
  }
  onPreviewClick() {
    console.log('Preview clicked in header'); // optional log
    this.previewClicked.emit();
  }

  onBackClick() {
    console.log('Back to Editor clicked');
    this.backToEditor.emit();
  }
}
