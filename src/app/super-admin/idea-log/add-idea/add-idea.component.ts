import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../shared/services/alert.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DashboardService } from '../../../analytics/dashboard/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-idea',
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.scss']
})
export class AddIdeaComponent implements OnInit {

  addIdeaForm: FormGroup;
  priorities = [{ id: 1, level: "High" }, { id: 2, level: "Medium" }, { id: 3, level: "Low" }];

  constructor(public datePipe: DatePipe, public dialogRef: MatDialogRef<AddIdeaComponent>, @Inject(MAT_DIALOG_DATA) public idea: any,
    private alertService: AlertService, private fb: FormBuilder, private dashboardService: DashboardService) {
    this.createIdeaForm();
  }

  ngOnInit() {
    if (this.idea) {
      console.log(this.idea);
      this.addIdeaForm.controls['addSubject'].setValue(this.idea.subject);
      this.addIdeaForm.controls['addDescription'].setValue(this.idea.description);
      this.addIdeaForm.controls['addPriority'].setValue(this.idea.priorityLevel);
      // var tDate = new Date(this.datePipe.transform(this.idea.targetDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"), 'MM/dd/yyyy'));
      this.addIdeaForm.controls['targetDate'].setValue(this.idea.demoDate);
      this.addIdeaForm.controls['devDate'].setValue(this.idea.devDate);
      this.addIdeaForm.controls['qaDate'].setValue(this.idea.qaDate);
    }
  }

  noWhiteSpaceValidator(control: FormControl) {
    let isWhiteSpace = (control.value || '').trim().length === 0;
    let isValid = !isWhiteSpace;
    return isValid ? null : { 'whitespace': true };
  }

  createIdeaForm() {
    this.addIdeaForm = this.fb.group({
      addSubject: new FormControl('', [Validators.required,this.noWhiteSpaceValidator]),
      addDescription: new FormControl('', [Validators.required, this.noWhiteSpaceValidator]),
      //completed:new  FormControl('',[Validators.required]),
      addPriority: new FormControl('', [Validators.required]),
      targetDate: new FormControl(''),
      devDate: new FormControl(''),
      qaDate: new FormControl(''),
      // code:new FormControl('',[Validators.required])
    });
  }

  get addSubject() { return this.addIdeaForm.get('addSubject'); }

  get addDescription() { return this.addIdeaForm.get('addDescription'); }

  get addPriority() { return this.addIdeaForm.get('addPriority'); }

  get targetDate() { return this.addIdeaForm.get('targetDate'); }

  get devDate() { return this.addIdeaForm.get('devDate'); }

  get qaDate() { return this.addIdeaForm.get('qaDate'); }


  close(): void {
    this.dialogRef.close();
  }

  saveIdea() {
    let obj = {};
    obj['subject'] = this.addIdeaForm.value.addSubject;
    obj['description'] = this.addIdeaForm.value.addDescription;
    obj['priorityLevel'] = this.addIdeaForm.value.addPriority;
    if(this.addIdeaForm.value.targetDate){
      let sd = new Date(this.addIdeaForm.value.targetDate);
      obj["demoDate"] = sd.setTime(sd.getTime() + (330 * 60 * 1000));
    }
    if(this.addIdeaForm.value.devDate){
      let sd = new Date(this.addIdeaForm.value.devDate);
      obj["devDate"] = sd.setTime(sd.getTime() + (330 * 60 * 1000));
    }
    if(this.addIdeaForm.value.qaDate){
      let sd = new Date(this.addIdeaForm.value.qaDate);
      obj["qaDate"] = sd.setTime(sd.getTime() + (330 * 60 * 1000));
    }
    
    if (this.idea) {
      obj['idea_id'] = this.idea.idea_id;
      this.dashboardService.updateIdea(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Idea updated successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }

      })
    }
    else {
      this.dashboardService.addNewIdea(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert("Idea added successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
  }

}
