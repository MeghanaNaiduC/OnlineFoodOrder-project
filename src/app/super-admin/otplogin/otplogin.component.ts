import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../../logins/login.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-otplogin',
  templateUrl: './otplogin.component.html',
  styleUrls: ['./otplogin.component.scss']
})
export class OtploginComponent implements OnInit {

  public form:FormGroup;
  public settings: Settings;
 
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

  public onSubmit(values:any):void {
    if (this.form.valid) {
      let obj = {};
      obj['otp'] = values.otp;
      obj['phone'] =  this.profile_number;
      this.loginService.validateAdminOTP(obj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.router.navigate(['/oFo/admin/courses']);
        } else {
          this.alertService.createAlert(data.message, 0);
          this.router.navigate(['/admin']);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

  ngOnInit() {
    if(localStorage.getItem("admin_user")) {
      this.profile_number = localStorage.getItem("admin_user");
    }
  }

}
