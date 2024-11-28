import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss'],
  providers: [AlertService, DashboardService]
})

export class FeesComponent implements OnInit {

  tableList: any;
  public popoverStatusTitle: string = 'Confirm Save Change';
  public popoverStatusMessage: string = 'Are you sure you want to save changes.?';
  public cancelClicked: boolean = false;
  pageEvent: PageEvent;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  showEmpty: boolean = true;

  constructor(private alertService: AlertService,  public dashboardService: DashboardService,  private changeDetectorRefs: ChangeDetectorRef) { 
    //this.getTimezones({});
  }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    let filterObj = {};
    filterObj['page'] = this.currentPage;
    filterObj['per_page'] = this.pageSize;
    filterObj['setting_type'] = 1;
    this.dashboardService.getSettings(filterObj).then( data => {
      if(data.success) {
        this.tableList = data.results;
        this.totalSize = data.count;
        data.count ? this.showEmpty = false : this.showEmpty = true;
        this.changeDetectorRefs.detectChanges();
      } else {
        this.tableList = [];
        this.totalSize = 0;
        this.showEmpty = true;
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getSettings();
  }

  saveSettings(item) {
    console.log(item);
    if(!item.new_value && item.settings_id !=6) {
      this.alertService.createAlert("Please enter valid data", 0);
      return;
    }

    if(item.settings_id ==6 &&  item.new_value > 100) {
      this.alertService.createAlert("Please enter valid data", 0);
      return;
    }
    
    this.dashboardService.updateSettings(item).then( data => {
      if(data.success) {
        this.getSettings();
        this.alertService.createAlert("Settings saved successfully", 1);
      } else {
        this.getSettings();
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  allow_only_numbers(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58));
  }

}
