import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../login.service'
import { AlertService } from '../../shared/services/alert.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public addressForm: FormGroup;
  public settings: Settings;
  public course: any;
  public urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private location: Location, public appSettings: AppSettings, public fb: FormBuilder, public router: Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings;
    this.createAddressForm();
    this.createForm();
  }

  get contactName() { return this.form.get('contactName'); }
  get contactPhone() { return this.form.get('contactPhone'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get Confirmpassword() { return this.form.get('Confirmpassword'); }
  get golfCourseName() { return this.form.get('golfCourseName'); }
  get golfCourseAddress() { return this.addressForm.get('golfCourseAddress'); }
  get city() { return this.addressForm.get('city'); }
  get state() { return this.addressForm.get('state'); }
  get zip() { return this.addressForm.get('zip'); }
  get url() { return this.addressForm.get('url'); }

  createAddressForm() {
    this.addressForm = this.fb.group({
      golfCourseAddress: new FormControl('', [Validators.maxLength(200), Validators.required]),
      city: new FormControl('', [Validators.maxLength(30), Validators.required]),
      state: new FormControl('', [Validators.maxLength(30), Validators.required]),
      zip: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.maxLength(50), Validators.required, Validators.pattern(this.urlRegex)]),
      termsnconds: [false, Validators.required],
      //leadAddress: new FormControl('', [Validators.maxLength(300), Validators.required])
    })
  }

  createForm() {
    this.form = this.fb.group({
      contactName: new FormControl('', [Validators.maxLength(30), Validators.required]),
      contactPhone: new FormControl('', [Validators.maxLength(30), Validators.required]),
      email: new FormControl('', [Validators.maxLength(30), Validators.required]),
      password: new FormControl('', [Validators.required]),
      Confirmpassword: new FormControl('', [Validators.required, this.MatchPassword]),
      golfCourseName: new FormControl('', [Validators.maxLength(30), Validators.required])
    })
  }

  MatchPassword(AC: FormControl) {
    let dataForm = AC.parent;
    if (!dataForm) return null;

    var Confirmpassword = dataForm.get('Confirmpassword');
    let password = dataForm.get('password').value;
    let confirmPassword = Confirmpassword.value;

    if (password != confirmPassword) {
      /* for Confirmpassword from current field "password" */
      dataForm.controls["Confirmpassword"].setErrors({ MatchPassword: true });
      if (Confirmpassword == AC) {
        /* for current field "Confirmpassword" */
        return { Confirmpassword: { MatchPassword: true } };
      }
    } else {
      dataForm.controls["Confirmpassword"].setErrors(null);
    }
    return null;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.Confirmpassword.value;
    group.controls['Confirmpassword'].setErrors({ 'incorrect': true });
    return pass === confirmPass ? null : { notSame: true }
  }

  ngOnInit() {
    //this.form.controls['contactPhone'].setValue('+1');
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/login'])
  }

  emailCheck(values) {
    let obj = {'email':values};
    this.loginService.checkEmail(obj).then(data => {
      if (data.success) {
        this.course = data.results
      }
      else {
        this.alertService.createAlert("Email already exists.Please login to continue", 0);
      }
    })
  }

  public saveUser() {
    let finalObj = {};
    if (!this.addressForm.value.termsnconds) {
      this.alertService.createAlert("Please check the terms and conditions checkbox to proceed.", 0);
      return false;
    }
    finalObj['name'] = this.form.value.contactName;
    finalObj['phone'] = this.form.value.contactPhone;
    finalObj['email'] = this.form.value.email;
    finalObj['password'] = this.form.value.password;
    finalObj['address'] = this.addressForm.value.golfCourseAddress;
    finalObj['city'] = this.addressForm.value.city;
    finalObj['state'] = this.addressForm.value.state;
    finalObj['zip'] = this.addressForm.value.zip;
    finalObj['url'] = this.addressForm.value.url;
    this.loginService.registerUser(finalObj).then(data => {
      if (data.success) {
        localStorage.setItem('register_phone', this.form.value.contactPhone);
        this.alertService.createAlert("User added Successfully.Verification is pending", 1);
        this.router.navigate(['/otpverification']);
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
