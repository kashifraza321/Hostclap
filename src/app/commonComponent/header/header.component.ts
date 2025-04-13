import {
  Component,
  EventEmitter,
  HostListener,
  NgZone,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isFixed = false;

  isHalfShown = false;
  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal, private ngZone: NgZone) {}

  toggleSidebar() {
    this.isHalfShown = !this.isHalfShown;
    this.dataEvent.emit(this.isHalfShown);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.ngZone.run(() => {
      console.log('Scroll position:', window.scrollY);
      this.isFixed = window.scrollY > 50;
      console.log('Header fixed:', this.isFixed);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(`Closed with: ${result}`);
        },
        (reason) => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
