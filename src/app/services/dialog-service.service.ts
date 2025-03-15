import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(private dialog: MatDialog) { 

  }
 openDialog(component: any, data: any = {}, width: string = '500px'): MatDialogRef<any> {
    return this.dialog.open(component, {
      width: width,
      data: data,
    });
  }
}
