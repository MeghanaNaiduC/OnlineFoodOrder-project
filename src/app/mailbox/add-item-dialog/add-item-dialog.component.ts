import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { AlertService } from '../../shared/services/alert.service';
import { DashboardService } from '../../analytics/dashboard/dashboard.service';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddItemDialogComponent implements OnInit {

  addCategoryForm: FormGroup;
  localData: any;
  showWarning: boolean = false;

  constructor(public alertService: AlertService,
    public dashboardService: DashboardService,
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any, private fb: FormBuilder) {
      this.dialogRef.disableClose = true;
    this.createUserForm();
  }

  close(): void {
    this.dialogRef.close();
  }


  get addItem() { return this.addCategoryForm.get('addItem'); }

  get addConfiguration() { return this.addCategoryForm.get('addConfiguration'); }

  get dollar() { return this.addCategoryForm.get('dollar'); }


  createUserForm() {
    this.addCategoryForm = this.fb.group({
      addItem: new FormControl('', [Validators.maxLength(250), Validators.required]),
      addConfiguration: new FormControl('', [Validators.maxLength(250), Validators.required]),
      dollar: new FormControl('', [Validators.maxLength(7), Validators.required]),
      is_popular: new FormControl(false, []),
      is_out_of_stock: new FormControl(false, []),
      is_gst: new FormControl(false, []),
      is_pst: new FormControl(false, []),
      is_hst: new FormControl(false, []),
      is_liquor: new FormControl(false, [])
    });
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;

    const value = this.addCategoryForm.get('dollar').value;
    if (value) {
      const prefix: string = value.toString().split('.')[0];
      const suffix: string = value.toString().split('.')[1];
      if (suffix && suffix.length > 2) {
        const suffix_subed = suffix.substr(0, 2);
        const new_value = prefix + '.' + suffix_subed;
        this.addCategoryForm.get('dollar').setValue(new_value);
      }
    }

    return ((k > 47 && k < 58) || k == 46)
  }

  forCurrency($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(2);
  }


  ngOnInit() {
    console.log(this.user);
    this.showWarning = false;
    this.localData = JSON.parse(localStorage.getItem('login_user_info'));
    console.log(this.localData);
    if (this.localData && this.localData.courseData) {
      this.addCategoryForm.controls['is_gst'].setValue(this.localData.courseData.is_gst);
      this.addCategoryForm.controls['is_pst'].setValue(this.localData.courseData.is_pst);
      this.addCategoryForm.controls['is_hst'].setValue(this.localData.courseData.is_hst);
      this.addCategoryForm.controls['is_liquor'].setValue(this.localData.courseData.is_liquor);


      if ((this.localData.courseData.is_gst && this.localData.courseData.gst_is_mandatory) || !this.localData.courseData.is_gst) {
        this.addCategoryForm.controls['is_gst'].disable();
      }

      if ((this.localData.courseData.is_pst && this.localData.courseData.pst_is_mandatory) || !this.localData.courseData.is_pst) {
        this.addCategoryForm.controls['is_pst'].disable();
      }

      if ((this.localData.courseData.is_hst && this.localData.courseData.hst_is_mandatory) || !this.localData.courseData.is_hst) {
        this.addCategoryForm.controls['is_hst'].disable();
      }

      if ((this.localData.courseData.is_liquor && this.localData.courseData.liquor_is_mandatory) || !this.localData.courseData.is_liquor) {
        this.addCategoryForm.controls['is_liquor'].disable();
      }
    }

    if (this.user.name) {
      this.addCategoryForm.controls['addItem'].setValue(this.user.name);
      this.addCategoryForm.controls['addConfiguration'].setValue(this.user.foodDescription);
      this.addCategoryForm.controls['dollar'].setValue(this.user.price);
      this.addCategoryForm.controls['is_popular'].setValue(this.user.is_popular);
      this.addCategoryForm.controls['is_out_of_stock'].setValue(this.user.is_out_of_stock);

      this.addCategoryForm.controls['is_gst'].setValue(this.user.is_gst);
      this.addCategoryForm.controls['is_pst'].setValue(this.user.is_pst);
      this.addCategoryForm.controls['is_hst'].setValue(this.user.is_hst);
      this.addCategoryForm.controls['is_liquor'].setValue(this.user.is_liquor);

      if ((this.localData.courseData.gst_is_mandatory && !this.user.is_gst) ||
        (this.localData.courseData.pst_is_mandatory && !this.user.is_pst) ||
        (this.localData.courseData.hst_is_mandatory && !this.user.is_hst) ||
        (this.localData.courseData.liquor_is_mandatory && !this.user.is_liquor)) {

        this.showWarning = true;
        this.alertService.createAlert("Please note that the tax settings for the course have changed and have been reset for this item.", 0);

        this.addCategoryForm.controls['is_gst'].setValue(this.localData.courseData.is_gst);
        this.addCategoryForm.controls['is_pst'].setValue(this.localData.courseData.is_pst);
        this.addCategoryForm.controls['is_hst'].setValue(this.localData.courseData.is_hst);
        this.addCategoryForm.controls['is_liquor'].setValue(this.localData.courseData.is_liquor);
      }


    }

  }

  saveCategory() {

    if (this.addCategoryForm.value.is_popular && this.addCategoryForm.value.is_out_of_stock) {
      this.alertService.createAlert("Popular item cannot be Out of stock.", 0);
      return false;
    }

    if (this.localData && this.localData.courseData) {
      if (this.localData.courseData.is_gst && this.localData.courseData.gst_is_mandatory) {
        this.addCategoryForm.value.is_gst = true;
      }

      if (this.localData.courseData.is_pst && this.localData.courseData.pst_is_mandatory) {
        this.addCategoryForm.value.is_pst = true;
      }

      if (this.localData.courseData.is_hst && this.localData.courseData.hst_is_mandatory) {
        this.addCategoryForm.value.is_hst = true;
      }

      if (this.localData.courseData.is_liquor && this.localData.courseData.liquor_is_mandatory) {
        this.addCategoryForm.value.is_liquor = true;
      }
    }



    if (this.user.name) {
      let obj = {};
      obj['id'] = this.user.id;
      obj['categoryId'] = this.user.categoryId;
      obj['courseId'] = this.user.courseId;
      obj['name'] = this.addCategoryForm.value.addItem
      obj['price'] = this.addCategoryForm.value.dollar;
      obj['foodDescription'] = this.addCategoryForm.value.addConfiguration;
      obj['is_popular'] = this.addCategoryForm.value.is_popular;
      obj['courseId'] = this.user.courseId;
      //obj['menuSectionIds'] = this.user.menuSectionIds;
      obj['is_out_of_stock'] = this.addCategoryForm.value.is_out_of_stock;
      obj['is_gst'] = this.addCategoryForm.value.is_gst;
      obj['is_pst'] = this.addCategoryForm.value.is_pst;
      obj['is_hst'] = this.addCategoryForm.value.is_hst;
      obj['is_liquor'] = this.addCategoryForm.value.is_liquor;
      console.log(obj);
      this.dashboardService.updateItem(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Item updated Successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          console.log("Log here")
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
    else {
      let obj = {};
      obj['name'] = this.addCategoryForm.value.addItem
      obj['categoryId'] = this.user.category_id;
      obj['price'] = this.addCategoryForm.value.dollar;
      obj['foodDescription'] = this.addCategoryForm.value.addConfiguration;
      obj['menuSectionId'] = this.user.menuSectionId;
      obj['is_popular'] = this.addCategoryForm.value.is_popular;
      obj['courseId'] = this.user.courseId;
      //obj['menuSectionIds'] = this.user.menuSectionIds;
      obj['is_out_of_stock'] = this.addCategoryForm.value.is_out_of_stock;
      obj['is_gst'] = this.addCategoryForm.value.is_gst;
      obj['is_pst'] = this.addCategoryForm.value.is_pst;
      obj['is_hst'] = this.addCategoryForm.value.is_hst;
      obj['is_liquor'] = this.addCategoryForm.value.is_liquor;
      console.log(obj);
      this.dashboardService.addItem(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Item added Successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
  }

}
