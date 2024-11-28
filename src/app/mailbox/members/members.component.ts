import { Component, OnInit, ChangeDetectorRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import { AlertService } from '../../shared/services/alert.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ProfileDialogComponent } from '../../theme/components/user-menu/profile-dialog/profile-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  public popoverAcceptTitle: string = 'Accept Member';
  public popoverAcceptMessage: string = 'Are you sure! You want to accept this user as a member ?';
  public popoverRejectTitle: string = 'Reject Member';
  public popoverRejectMessage: string = 'Are you sure! You want to reject this user as a member ?';
  public cancelClicked: boolean = false;


  public settings: Settings;
  public user: any;
  public totalMembers = [];
  public members = [];
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  public name_filter = "";
  public status_filter = "";
  public filterToggle = false;
  
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public alertService: AlertService,
    public dashboardService: DashboardService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  filterUsers() {
    let temp = { "courseId": this.user.courseId };
    if(this.name_filter)
        temp['phone'] = this.name_filter;
    if(this.status_filter)
        temp['req_status'] = parseInt(this.status_filter);
    if(('phone' in temp) || ('req_status' in temp)) {
      this.getMemberRequests(temp);
    }
  }

  omit_special_number_char(event) {
      var k;
      k=event.charCode;
      return ((k > 64 && k < 91) || (k > 47 && k < 58) || (k > 96 && k < 123) || k == 8 || k == 32)
  }

  clearFilters() {
      this.name_filter = "";
      this.status_filter = "";
      this.getMemberRequests({ "courseId": this.user.courseId });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.members = this.totalMembers.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
  }

  ngOnInit() {
    /* this.members.push({"name":"abc","mobile":"1234","date":"2019-06-24","req_status":1},
    {"name":"abc","mobile":"1234","date":"2019-06-24","req_status":2},
    {"name":"abc","mobile":"1234","date":"2019-06-24","req_status":3}); */
    this.user = JSON.parse(localStorage.getItem('login_user_info'));
    if(this.user && !this.user.courseData.is_signup_completed) {
      this.user.canCancel = 0;
      this.openProfileDialog(this.user);
    } else {
      if(this.user.courseId)
        this.getMemberRequests({ "courseId": this.user.courseId });
    }
  }

  public openProfileDialog(id) {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: id,
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

  getMemberRequests(obj) {
    this.dashboardService.getMemberRequests(obj).then(data => {
      if (data.success) {
        this.totalMembers = data.results;
        this.totalSize = data.results.length;
        this.members = this.totalMembers.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.members = [];
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  updateRequest(member, req_status) {
    let obj = {};
    obj['courseId'] = member.courseId;
    obj['user_id'] = member.user_id;
    obj['req_status'] = req_status;
    this.dashboardService.updateRequest(obj).then(data => {
      if (data.success) {
        this.alertService.createAlert('Member request updated successfully.', 1);
        this.getMemberRequests({ "courseId": this.user.courseId });
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  public openConfirmDialog(action, value, name, id, delValue) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 'action': action, 'value': value, 'name': name }
    });

    dialogRef.afterClosed().subscribe(account => {
      if (account) {
        if (delValue == 'category') {
          let obj = {};
          obj['_id'] = id;
          this.dashboardService.deleteCategory(obj).then(data => {
            if (data.success) {
              this.alertService.createAlert("Item deleted", 1);
            }
            else {
              this.alertService.createAlert(data.message, 0);
            }
          })
        }
        if (delValue == 'item') {
          let obj = {};
          obj['_id'] = id;
          this.dashboardService.deleteItem(obj).then(data => {
            if (data.success) {
              this.alertService.createAlert("Item deleted", 1);
            }
            else {
              this.alertService.createAlert(data.message, 0);
            }
          })
        }

      } else {
        //this.getAccounts({},'initial');
        this.dialog.closeAll();
      }
    });
  }

}
