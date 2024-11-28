import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCourseComponent } from './add-course/add-course.component';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import { AlertService } from '../../shared/services/alert.service';
import { Alert } from 'selenium-webdriver';
import { ResetpasswordComponent } from 'src/app/logins/resetpassword/resetpassword.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { Router } from '@angular/router';
import { AddNewCourseComponent } from '../add-new-course/add-new-course.component';
import { ProfileDialogComponent } from '../../theme/components/user-menu/profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  showEmpty: boolean = true;
  courses: any;
  totalCourses: any;
  public popoverTitle: string = 'Confirm Delete';
  public popoverMessage: string = 'Are you sure you want to delete this.?';
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status.?';
  public cancelClicked: boolean = false;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  
  constructor(public router: Router,
    public dialog: MatDialog, public dashboardService: DashboardService, public alertService: AlertService) { }
    
    ngOnInit() {
      this.getCourses({});
    }
    
    getCourses(obj) {
      this.dashboardService.getCourses(obj).then(data => {
        if (data.success) {
          this.totalCourses = data.results;
          console.log(this.totalCourses);
          this.courses = this.totalCourses.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
          this.totalSize = data.results.length;
          if (this.courses) {
            this.courses.forEach((ele, key) => {
              this.courses[key].menusText = [];
              ele.tbl_menu_sections.forEach((element, key1) => {
                if (element) {
                  this.courses[key].menusText[key1] = element.name;
                }
              });
              if (this.courses[key].menusText) {
                this.courses[key].menusText = this.courses[key].menusText.join(',');
              } else {
                this.courses[key].menusText = "";
              }
            });
          }
          this.showEmpty = false;
          if (!data.results.length) {
            this.showEmpty = true;
          }
        }
        else {
          this.showEmpty = true;
          this.alertService.createAlert(data.message, 0);
        }
      });
    }
    
    openCourseDialog(course) {
      if(course) {
        course.canCancel = 1;
        course.courseId = course.id;
        let dialogRef = this.dialog.open(ProfileDialogComponent, {
          data: course,
          height: 'auto',
          width: '65%',
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data === "save") {
            this.getCourses({});
          }
        });
      }
      else {
        let dialogRef = this.dialog.open(AddNewCourseComponent, {
          data: course,
          height: 'auto',
          width: '65%',
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data === "save") {
            this.getCourses({});
          }
        });
      }
      
    }
    
    public handlePage(e: any) {
      this.currentPage = e.pageIndex;
      this.pageSize = e.pageSize;
      this.courses = this.totalCourses.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
    }
    
    updateCourseStatus(course_id, value, type) {
      let temp = {};
      temp['id'] = course_id;
      if (type === 'delete')
      temp['is_deleted'] = value;
      else if (type === 'status')
      temp['is_active'] = value;
      this.dashboardService.updateCourseStatus(temp).then(data => {
        if (data.success) {
          if (type === 'delete') {
            this.alertService.createAlert('Course deleted successfully', 1);
          } else if (type === 'status') {
            this.alertService.createAlert('Course ' + (value ? 'activated' : 'deactivated') + ' successfully', 1);
          }
          this.dialog.closeAll();
          this.getCourses({});
        } else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    }
    
    openRestPasswordDialog(course) {
      let dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
        data: course,
        height: 'auto',
        width: '600px',
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data === "save") { }
        //this.getUser(null);
      });
    }
    
    
    updateUser() {
      
    }
    
    viewCourseSurveys(course) {
      this.router.navigate(['/oFo/admin/surveys/' + btoa(course.id) + '/' + btoa(course.name)]);
    }
    
    
    
  }
  