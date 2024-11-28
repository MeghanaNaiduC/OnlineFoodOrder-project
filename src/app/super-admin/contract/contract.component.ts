import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [AlertService, DashboardService]
})

export class ContractComponent implements OnInit {

  data: any;
  public editorContent: string = '';
  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "300px",
    "minHeight": "300px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Contract information will be displayed here.",
    "imageEndPoint": "",
    "toolbar": [
        ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
        ["fontName", "fontSize", "color"],
        ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
        ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
        ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
        ["link", "unlink"]
    ]
  };

  constructor(private alertService: AlertService,  public dashboardService: DashboardService,  private changeDetectorRefs: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    let filterObj = {};
    filterObj['page'] = 0;
    filterObj['per_page'] = 1;
    filterObj['setting_type'] = 2;
    this.dashboardService.getSettings(filterObj).then( data => {
      if(data.success) {
        this.data = data.results[0];
        this.editorContent = this.data.value;
        this.changeDetectorRefs.detectChanges();
      } else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  saveSettings() {
    let item = {};
    item['new_value'] = this.editorContent;
    item['settings_id'] = this.data.settings_id;
    this.dashboardService.updateSettings(item).then( data => {
      if(data.success) {
        this.getSettings();
        this.alertService.createAlert("Contract saved successfully", 1);
      } else {
        this.getSettings();
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

}
