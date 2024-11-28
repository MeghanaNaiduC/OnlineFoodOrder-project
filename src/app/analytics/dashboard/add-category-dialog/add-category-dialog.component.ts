import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl,FormBuilder,FormGroup,Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {

  addCategoryForm:FormGroup;

  constructor(public dialogRef: MatDialogRef<AddCategoryDialogComponent>,@Inject(MAT_DIALOG_DATA) public user: any, private fb:FormBuilder) { 
    this.createUserForm();
  }

  close(): void {
    this.dialogRef.close();
  }


  get addItem() { return this.addCategoryForm.get('addItem'); }

  get addConfiguration() { return this.addCategoryForm.get('addConfiguration'); }

  get dollar() { return this.addCategoryForm.get('dollar'); }


  createUserForm() {
    this.addCategoryForm=this.fb.group({
      addItem: new FormControl('',[Validators.maxLength(15),Validators.required]),
      addConfiguration:new FormControl('',[Validators.maxLength(15),Validators.required]),
      dollar:new FormControl('',[Validators.maxLength(7),Validators.required]),
    });
  }

  ngOnInit() {
  }

  saveCategory() {
    this.dialogRef.close('save');
  }

}
