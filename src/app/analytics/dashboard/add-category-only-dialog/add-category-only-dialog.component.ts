import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl,FormBuilder,FormGroup,Validators, Form } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-add-category-only-dialog',
  templateUrl: './add-category-only-dialog.component.html',
  styleUrls: ['./add-category-only-dialog.component.scss']
})
export class AddCategoryOnlyDialogComponent implements OnInit {

  addCategoryOnlyForm:FormGroup;

  constructor(public alertService: AlertService,public dashboardService: DashboardService,public dialogRef: MatDialogRef<AddCategoryOnlyDialogComponent>,@Inject(MAT_DIALOG_DATA) public user: any, private fb:FormBuilder) { 
    this.createUserForm();
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }


  get addCategory() { return this.addCategoryOnlyForm.get('addCategory'); }

  createUserForm() {
    this.addCategoryOnlyForm=this.fb.group({
      addCategory: new FormControl('',[Validators.maxLength(15),Validators.required]),
    });
  }

  saveCategory() {
    let obj = {};
    obj['category_name'] = this.addCategoryOnlyForm.value.addCategory;
    this.dashboardService.addCategory(obj).then(data => {
      if(data.success) {
        this.alertService.createAlert("Category added Successfully",1);
        this.dialogRef.close('save');    
      }
      else {
        this.alertService.createAlert(data.message,0);
      }
    });
  }

}
