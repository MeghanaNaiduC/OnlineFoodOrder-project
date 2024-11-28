import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
  providers: [AlertService, DashboardService]
})

export class TaxesComponent implements OnInit {

  tableList: any;
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
    this.getStates();
  }

  getStates() {
    let filterObj = {};
    filterObj['countryId'] = 38;
    this.dashboardService.getProvinces(filterObj).then( data => {
      if(data.success) {
        this.tableList = data.results;
        this.totalSize = data.results.length;
        data.results.length ? this.showEmpty = false : this.showEmpty = true;
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
    this.getStates();
  }

  saveTaxes(item) {
    if(item.hst > 30 || item.pst > 30 || item.gst > 30) {
      this.alertService.createAlert("Invalid tax value", 0);
      return;
    }
    this.dashboardService.updateStatesTax(item).then( data => {
      if(data.success) {
        this.getStates();
        this.alertService.createAlert("Taxes saved successfully", 1);
      } else {
        this.getStates();
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  accept_float_numbers(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58) || (k == 46));
  }

}
