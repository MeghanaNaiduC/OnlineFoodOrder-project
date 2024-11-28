import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/logins/login.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MustMatch } from 'src/app/shared/must-match.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PasswordDialogComponent } from 'src/app/theme/components/user-menu/password-dialog/password-dialog.component';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {
  changePasswordForm: FormGroup;
  isOneLetter = false;
  isOneCapitalLetter = false;
  isOneNumber = false;
  isOneSpecialCaharacter = false;
  isMinLength = false;
  isValidate = false;
  currentUser: any;
  show: boolean;
  shown: boolean;

  constructor(public loginService: LoginService,
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public course: any, private fb: FormBuilder, private alertService: AlertService) {
    this.createPasswordForm();
    this.show = false;
    this.shown = false;
  }

  get userNewPassword() { return this.changePasswordForm.get('userNewPassword'); };
  get userNewReenterPassword() { return this.changePasswordForm.get('userNewReenterPassword'); };

  ngOnInit() {
    if (this.course) {
      console.log(this.course);
      this.currentUser = this.course.tbl_admin_users[0];
      if (this.currentUser) {
        this.changePasswordForm.controls['phone'].setValue(this.currentUser.phone);
        this.changePasswordForm.controls['phone'].disable();
      }
    }
  }

  createPasswordForm() {
    this.changePasswordForm = this.fb.group({
      phone: new FormControl('', [Validators.required, Validators.maxLength(15), this.noWhiteSpaceValidator]),
      userNewPassword: new FormControl('', [Validators.required, Validators.maxLength(30), this.noWhiteSpaceValidator]),
      userNewReenterPassword: new FormControl('', [Validators.required, Validators.maxLength(30), this.noWhiteSpaceValidator]),
    }, {
        validator: MustMatch('userNewPassword', 'userNewReenterPassword')
      });
  }

  updatePassword(formData) {
    let temp = {};
    temp['phone'] = this.currentUser.phone;
    temp['password'] = formData.userNewPassword;
    this.loginService.resetUserPassword(temp).then(data => {
      if (data.success) {
        this.alertService.createAlert("Password updated Successfully", 1);
        this.dialogRef.close('save');
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  onKeyPress(e) {
    var pswd = e.value;
    //validate the length
    if (pswd.length < 8) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
    }

    //validate letter
    if (pswd.match(/[A-z]/)) {
      if (pswd != '_') {
        this.isOneLetter = true;
      } else {
        this.isOneLetter = false;
      }
    } else {
      this.isOneLetter = false;
    }

    //validate uppercase letter
    if (pswd.match(/[A-Z]/)) {
      this.isOneCapitalLetter = true;
    } else {
      this.isOneCapitalLetter = false;
    }

    //validate special character
    if (pswd.match(/[!@#\$%\^&\_\+\<\>\.\,\=\:\;\'\?\(\)\[\]\\\/\|\*{}-]/)) {
      this.isOneSpecialCaharacter = true;
    } else {
      this.isOneSpecialCaharacter = false;
    }

    //validate number
    if (pswd.match(/\d/)) {
      this.isOneNumber = true;
    } else {
      this.isOneNumber = false;
    }

  }

  noWhiteSpaceValidator(control: FormControl) {
    let isWhiteSpace = (control.value || '').trim().length === 0;
    let isValid = !isWhiteSpace;
    return isValid ? null : { 'whitespace': true };
  }


  close(): void {
    this.dialogRef.close();
  }

}
