import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { MatDialog } from '@angular/material';
import { LoginService } from '../../../logins/login.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { ConfirmSubscriptionCancelDialogComponent } from './confirm-subscription-cancel-dialog/confirm-subscription-cancel-dialog.component';
import { DashboardService } from 'src/app/analytics/dashboard/dashboard.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {

  public userImage = '../assets/img/profile_pic.png';
  name: any;
  designation: any;
  user: any;
  newObj: any;

  constructor(private dialogRef: MatDialog,
     private changeDetectorRefs: ChangeDetectorRef, 
     public dialog: MatDialog, public router: Router,
     public dashboardService:DashboardService, public loginService: LoginService, public alertService: AlertService) { }

  public changePasswordDialog(id) {
    let dialogRef = this.dialog.open(PasswordDialogComponent, {
      data: id,
      height: 'auto',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public openProfileDialog(id) {
    this.user.canCancel = 1;
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: this.user,
      height: 'auto',
      width: '65%',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data == 'save') {
        this.router.navigate(['/']);
      }
    });
  }

  public cancelSubscriptionDialog() {
    let dialogRef = this.dialog.open(ConfirmSubscriptionCancelDialogComponent, {
      data: { 'courseId': null }
    });

    dialogRef.afterClosed().subscribe(account => {
      if (account) {
        this.cancelSubscription();
      } else {
        this.dialog.closeAll();
      }
    });
  }

  cancelSubscription(  ) {
    let newObj = JSON.parse(localStorage.getItem('login_user_info'));
    console.log(newObj.courseId);
   let temp = {};
    temp['courseId'] = newObj.courseId;
    this.dashboardService.cancelSubscription(temp).then(data => {
      if(data.success) {
        this.alertService.createAlert(data.message, 1);
        this.dialog.closeAll();
        this.router.navigate(['/']);
      } else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }


  public logoutUser() {
    this.loginService.logOut().then(res => {
      if (res.success) {
        this.dialogRef.closeAll();
        localStorage.removeItem('login_user_info');
        localStorage.removeItem('admin_user');
        if (localStorage.getItem('usertype') && localStorage.getItem('usertype') == "admin") {
          localStorage.removeItem('usertype');
          this.router.navigate(['/admin/login']);
        } else {
          localStorage.removeItem('usertype');
          this.router.navigate(['/login']);
        }
        this.alertService.createAlert(res.message, 1);
      } else {
        this.alertService.createAlert(res.message, 0);
      }
    }).catch(e => {
      console.log(e);
    });
  }

  newData(obj) {
    //var currentUser = localStorage.getItem('login_user_info');
    //obj['courseId'] = currentUser;
    this.newObj = JSON.parse(localStorage.getItem('login_user_info'));
    console.log(this.newObj);
    //console.log("here1");
    obj['id'] = this.newObj._id;
    this.loginService.getUpdatedUserInfo(obj).then(res => {
      //console.log("here2");
      if (res.success) {
        console.log("Why")
        console.log(res);
        localStorage.removeItem('login_user_info');
        localStorage.setItem('login_user_info', JSON.stringify({
          _id: res.id, email: res.email, name: res.name,
          phone: res.phone, address: res.address, city: res.city, state: res.users.tbl_province.province, zip: res.zip, url: res.url, menuData: res.users.tbl_menu_sections,
          courseName: res.courseName, courseId: res.courseId, courseData: res.courseData, stateRes: res.users.tbl_province
        }));
        let names = JSON.parse(localStorage.getItem('login_user_info'));
        console.log(names);
        this.name = names.name;
      }
      else {
        this.alertService.createAlert(res.message, 0);
      }
      //console.log("here3");
      //console.log(localStorage.getItem('login_user_info'));
    });

  }

  loadData() {
    var currentUser = JSON.parse(localStorage.getItem('login_user_info'));
    if (currentUser) {
      this.user = currentUser;
      this.name = currentUser.name;
      this.designation = currentUser.role;
      if (currentUser.img) {
        this.userImage = currentUser.img;
      }
    }

    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit() {
    this.loadData();
  }

}
