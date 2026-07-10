import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-request-detal-modal',
  standalone: true,
  imports: [],
  templateUrl: './booking-request-detal-modal.component.html',
  styleUrl: './booking-request-detal-modal.component.css',
})
export class BookingRequestDetalModalComponent {
  formData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(
    private dialogRef: MatDialogRef<BookingRequestDetalModalComponent>
  ) {}

  onSubmit() {
    console.log('Form Data:', this.formData);
    this.dialogRef.close(this.formData);
  }
  closeModal() {
    this.dialogRef.close();
  }
}
