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
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  providers: [LoginService, AlertService],
})
export class ForgotpasswordComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;

  constructor(public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'phone': [null, Validators.compose([Validators.required])],
    });
   }

   goBack() {
     this.location.back();
   }

   omit_special_char(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58))
  }

  ngOnInit() {

    
  }

  public onSubmit(values:any):void {
    if (this.form.valid) {
      this.loginService.forgetPassword(values.phone).then(res => {
        if (res.success) {
          localStorage.setItem('forgot_password_phone',(res.phone));
          this.alertService.createAlert(res.message, 1);
          this.router.navigate(['/otpverification']);
        } else {
          this.alertService.createAlert(res.message, 0);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
