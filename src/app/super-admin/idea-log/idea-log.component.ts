import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertService } from '../../shared/services/alert.service';
import { PageEvent } from '@angular/material';
import { AddIdeaComponent } from './add-idea/add-idea.component';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';

@Component({
  selector: 'app-idea-log',
  templateUrl: './idea-log.component.html',
  styleUrls: ['./idea-log.component.scss']
})
export class IdeaLogComponent implements OnInit {

  ideas : any;
  showEmpty:boolean = true;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  public popoverTitle: string = 'Confirm Delete';
  public popoverMessage: string = 'Are you sure you want to delete this.?';
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status.?';
  public cancelClicked: boolean = false;
  pageEvent: PageEvent;

  constructor(public alertService : AlertService,public dashboardService : DashboardService,public dialog: MatDialog) { }

  ngOnInit() {
    this.getIdeas({});
  }

  public addIdeaDialog(idea) {
    let dialogRef = this.dialog.open(AddIdeaComponent, {
      data: idea,
      height: 'auto',
      width: '700px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data == 'save') {
        this.getIdeas({});
      }
    });
  }

  public getIdeas(finalObj) {
    this.dashboardService.getAllIdea(finalObj).then(data => {
      if(data.success) {
        if(data.results.length) {
          this.showEmpty = false;
        }
        let allIdeas = data.results;
        this.ideas = allIdeas.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);

      }
      else {
        this.alertService.createAlert(data.message,0);
      }
    })
  }

  updateIdea(idea_id, changedValue, type) {
    let detail = { "idea_id": idea_id };
    if (type == 'next') {
      detail['is_next'] = changedValue;
    } else {
      detail['is_deleted'] = changedValue;
    }
    this.dashboardService.updateIdea(detail)
      .then(data => {
        if (data.success) {
          let message = "";
          if (type == 'next')
            message = changedValue ? "status changed to completed" : "status changed to incompleted";
          else
            message = "deleted";
          this.alertService.createAlert("Idea " + message + " successfully", 1);
          this.getIdeas({});
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getIdeas({});
  }
}
