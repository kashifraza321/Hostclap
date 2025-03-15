import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  standalone: true,
  imports: [],
  templateUrl: './common-dialog.component.html',
  styleUrl: './common-dialog.component.scss'
})
export class CommonDialogComponent {
   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommonDialogComponent>
  ) { }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
