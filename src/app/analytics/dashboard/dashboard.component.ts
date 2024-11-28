import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { AddCategoryOnlyDialogComponent } from './add-category-only-dialog/add-category-only-dialog.component';
import { DashboardService } from './dashboard.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  
  public userImage = "../assets/img/om_logo.png";
  public categories : any;
 

  constructor(public alertService: AlertService,public dashboardService: DashboardService,public dialog: MatDialog){
  }

  public addNewCategory(userInfo) {
    let dialogRef = this.dialog.open(AddCategoryDialogComponent, {
        data: userInfo,
        height: 'auto',
        width: '600px',
        autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
        if(data === "save") {

        } 
    });
}

public addCategory(userInfo) {
  let dialogRef = this.dialog.open(AddCategoryOnlyDialogComponent, {
      data: userInfo,
      height: 'auto',
      width: '600px',
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(data => {
      if(data === "save") {
        
      } 
  });
}

 
  ngOnInit() {
      this.getCategories({});
  }

  getCategories(obj) {
      this.dashboardService.getCategories(obj).then(data => {
          if(data.success) {
            this.categories = data.results;
          }
          else {
            this.alertService.createAlert(data.message,0);
          }
      })
  }
  
}
