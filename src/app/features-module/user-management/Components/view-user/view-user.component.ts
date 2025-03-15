import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { MaterialModule } from '../../../../../Module/material.module';
import { UserService } from '../../user-service/user.service';
import { AlertService } from '../../../../services/Toaster/alert.service';
import { DialogServiceService } from '../../../../services/dialog-service.service';
import { CommonDialogComponent } from '../../../../commonComponent/common-dialog/common-dialog.component';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, DatePipe],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent implements OnInit {
  displayedColums: string[] = ["teamName", "role", "memberName", "memberEmail"]
  datasource: any;
  page: number = 1;
  limit: number = 10;
  teamlist: any[] = [];
  totalItems: any;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _userData: UserService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private dialogService: DialogServiceService
  ) { }
  teamId: any
  ngOnInit(): void {
    this.datasource = new MatTableDataSource<any>(this.teamlist);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;


    this.route.params.subscribe((res: any) => {
      this.teamId = res['id']
    })

    this.getAllTeamUsers();


  }

 openMyDialog() {
   this.dialogService.openDialog(CommonDialogComponent, { message: 'Hello from Dialog!' },
      '400px', 
    
      
    )
      .afterClosed()
      .subscribe(result => {
        console.log('Dialog closed with result:', result);
      });
  }

redireToReportedBy(){}
  getAllTeamUsers() {
    this._userData.getUserTeamDetail(this.teamId, this.page, this.limit).subscribe((res: any) => {
      this.teamlist = res.data.list;
      this.totalItems = res.data.count;
      this.datasource.data = this.teamlist;
    })
  }

  onPaginateChange(event: any): void {
    this.page = (event.pageIndex + 1);
    this.limit = event.pageSize;
    this.getAllTeamUsers();
  }

  toggleStatus(id: string, type: string) {
    this._userData.updateUserStatus(id).subscribe((res: any) => {
      if (res) {
        this.alertService.success(res.message);
      }
    })
  }




}
