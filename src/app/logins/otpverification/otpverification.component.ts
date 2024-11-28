import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../login.service'
import { AlertService } from '../../shared/services/alert.service';


@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.component.html',
  styleUrls: ['./otpverification.component.scss'],
  providers: [LoginService, AlertService],
})
export class OtpverificationComponent implements OnInit {

  public form:FormGroup;
  public settings: Settings;
  public forgot_phone :any;
  public register_phone :any;
  public profile_number :any;


  constructor(public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) { 
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'otp': [null, Validators.compose([Validators.required])],
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.forgot_phone = null;
    this.register_phone = null;
    if(localStorage.getItem('forgot_password_phone')) {
      this.forgot_phone = localStorage.getItem('forgot_password_phone');
      localStorage.setItem('number_for_forget_password',localStorage.getItem('forgot_password_phone'));
      localStorage.removeItem('forgot_password_phone');
    }
    if(localStorage.getItem('profile_number')) {
      this.profile_number = localStorage.getItem('profile_number');
      
      localStorage.removeItem('profile_number');
    }
    if(localStorage.getItem('register_phone')) {
      this.register_phone = localStorage.getItem('register_phone');
      localStorage.removeItem('register_phone');
    }
  }

  public onSubmit(values:any):void {
    if (this.form.valid) {
      let obj = {};
      obj['otp'] = values.otp;
      obj['phone'] = this.register_phone ? this.register_phone : this.forgot_phone ? this.forgot_phone : this.profile_number;
      this.loginService.validateOTP(obj).then(res => {
        if (res.success) {
          this.alertService.createAlert(res.message, 1);
          if(this.forgot_phone)
            this.router.navigate(['/resetpassword']);
          else
            this.router.navigate(['/login']);
        } else {
          this.alertService.createAlert(res.message, 0);
          this.router.navigate(['/login']);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}
