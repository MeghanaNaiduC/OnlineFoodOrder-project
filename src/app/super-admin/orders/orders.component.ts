import { Component, OnInit, ChangeDetectorRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import { AlertService } from '../../shared/services/alert.service';
import { ExcelService } from '../../shared/services/excel.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public popoverAcceptTitle: string = 'Accept Member';
  public popoverAcceptMessage: string = 'Are you sure! You want to accept this user as a member ?';
  public popoverRejectTitle: string = 'Reject Member';
  public popoverRejectMessage: string = 'Are you sure! You want to reject this user as a member ?';
  public cancelClicked: boolean = false;


  public settings: Settings;
  public totalOrders = [];
  public orders = [];
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  public name_filter = "";
  public year : any;
  public month : any;
  public course : any;
  public courses = [];
  public filterToggle = false;
  public months = [{"name":"January","id":1},{"name":"February","id":2},{"name":"March","id":3},{"name":"April","id":4},{"name":"May","id":5},{"name":"June","id":6},
  {"name":"July","id":7},{"name":"August","id":8},{"name":"September","id":9},{"name":"October","id":10},{"name":"November","id":11},{"name":"December","id":12}];
  public years = [];
  
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public alertService: AlertService,
    public dashboardService: DashboardService,
    private changeDetectorRefs: ChangeDetectorRef,
    public excelService: ExcelService,
    public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  sendInvoice() {
    if(this.course) {
      let obj = {};
      obj['courseName'] = this.course.name;
      obj["contactName"] = this.course.tbl_admin_users[0]['name'];
      obj['courseId'] = this.course['id']
      obj['courseEmail'] = this.course.courseEmail;
      obj['startDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '01';
      obj['endDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '31';
      console.log(obj);
      this.dashboardService.generateMemberInvoice(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert('Invoice sent successfully.', 1);
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    } else {
      this.alertService.createAlert('Please select course', 0);
    }
  }

  downloadOrders() {
    if(this.course) {
      let data = [];
      for(let i=0; i< this.orders.length; i++) {
        let obj = {};
        obj['Order Id'] = this.orders[i]['orderId'];
        obj['Phone'] = this.orders[i]['tbl_users'][0]['phone'];
        obj['Total Quantity'] = 0;
        obj['Total Sales'] = this.orders[i]['totalPrice'];
        obj['Order Date'] = this.orders[i]['dateAdded'].slice(0,10);
        for(let k=0; k< this.orders[i]['tbl_order_details'].length; k++) {
          obj['Total Quantity'] += this.orders[i]['tbl_order_details'][k]['quantity'];
        }
        data.push(obj);
      }
      this.excelService.exportAsExcelFile(data, 'MemberOrders');
    } else {
      this.alertService.createAlert('Please select course', 0);
    }
  }

  filterUsers() {
    console.log(this.course);
    let temp = { "courseId": this.course.id };
    temp['startDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '01';
    temp['endDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '31';
    if(('phone' in temp) || ('startDate' in temp) || ('endDate' in temp)) {
      this.getCourseOrders(temp);
    }
  }

  omit_special_number_char(event) {
      var k;
      k=event.charCode;
      return ((k > 64 && k < 91) || (k > 47 && k < 58) || (k > 96 && k < 123) || k == 8 || k == 32)
  }

  clearFilters() {
    this.clearDates();
    let temp = { "courseId": this.course['id'] };
    temp['startDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '01';
    temp['endDate'] = this.year+'-'+ (this.month > 9 ? this.month : ('0'+this.month)) + '-'+ '31';
    this.getCourseOrders(temp);
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.orders = this.totalOrders.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
  }

  clearDates() {
    let d = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.year = d;
    for(let i=0; i< 5; i++) {
      this.years.push(d);
      d -= 1;
    }
  }

  ngOnInit() {
    /* this.members.push({"name":"abc","mobile":"1234","date":"2019-06-24","req_status":1},
    {"name":"abc","mobile":"1234","date":"2019-06-24","req_status":2},
    {"name":"abc","mobile":"1234","date":"2019-06-24","req_status":3}); */
    this.clearDates();
    this.getAllCourses({});
  }

  onCourseSelect(event) {
    console.log(event);
    if(event) {
      for( let i=0; i< this.courses.length; i++) {
        if(this.courses[i]['id'] == event) {
          this.course = this.courses[i];
          this.filterUsers();
          continue;
        }
      }
    } else {
      this.clearFilters();
    }
  }

  getAllCourses(obj) {
    this.dashboardService.getCourses(obj).then(data => {
      if (data.success) {
        this.courses = data.results;
      }
      else {
        this.courses = [];
        this.alertService.createAlert('Failed to fetch courses list.', 0);
      }
    });
  }

  getCourseOrders(obj) {
    this.dashboardService.getCourseOrders(obj).then(data => {
      if (data.success) {
        this.totalOrders = data.results;
        this.totalSize = data.results.length;
        this.orders = this.totalOrders.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.orders = [];
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

}