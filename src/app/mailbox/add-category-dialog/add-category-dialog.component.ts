import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { AlertService } from '../../shared/services/alert.service';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {

  addCategoryOnlyForm: FormGroup;

  constructor(public alertService: AlertService, public dashboardService: DashboardService, public dialogRef: MatDialogRef<AddCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public user: any, private fb: FormBuilder) {
    this.dialogRef.disableClose = true;
    this.createUserForm();
  }

  ngOnInit() {
    console.log(this.user);
    if (this.user.category_name) {
      this.addCategoryOnlyForm.controls['addCategory'].setValue(this.user.category_name);
    }
  }
  close(): void {
    this.dialogRef.close();
  }


  get addCategory() { return this.addCategoryOnlyForm.get('addCategory'); }

  createUserForm() {
    this.addCategoryOnlyForm = this.fb.group({
      addCategory: new FormControl('', [Validators.maxLength(250), Validators.required]),
    });
  }

  saveCategory() {
    if (this.user.category_name) {
      let obj = {};
      obj['id'] = this.user.id;
      obj['category_name'] = this.addCategoryOnlyForm.value.addCategory;
      this.dashboardService.updateCategory(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Category updated Successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
    else {
      let obj = {};
      obj['category_name'] = this.addCategoryOnlyForm.value.addCategory;
      obj['menuSectionId'] = this.user.id;
      this.dashboardService.addCategory(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Category added Successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    }

  }

}
