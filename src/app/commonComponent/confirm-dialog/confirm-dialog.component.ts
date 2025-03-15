import { AfterViewInit, Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,FormsModule],
  providers: [
    //   {
    //   provide: MatDialogRef,
    //   useValue: {}
    // }
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit {
  contentTemplate!: TemplateRef<any>;
 
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(state: boolean) {
    this.dialogRef.close(state);
  }
  ngOnInit() {
   console.log(this.data, "data")
  }

  onDone(){
    console.log("click")
    const result = {
      inputName: this.data.inputName,
      inputEmail: this.data.inputEmail,
      selectedFunctionalities: this.data.selectedFunctionalities
    };

    // Perform any necessary validation or processing here
    console.log('Done clicked with data:', result);

    // Close the dialog and return the result
    this.dialogRef.close(result); // You can pass the result back to the calling component
  }
  
}
