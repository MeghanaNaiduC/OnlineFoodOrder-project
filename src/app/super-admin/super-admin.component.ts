import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator } from '../theme/utils/app-validators';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { LoginService } from '../logins/login.service'
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
  providers: [ AlertService ],
})
export class SuperAdminComponent implements OnInit {

  public form:FormGroup;
  public settings: Settings;
  show:boolean;

  constructor(public loginService: LoginService,public appSettings:AppSettings, public fb: FormBuilder, public router:Router, public alertService: AlertService) { 
    this.settings = this.appSettings.settings; 
    this.show = false;
    this.form = this.fb.group({
      'phone': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  omit_special_char(event) {
    var k;
    k=event.charCode;
    return ((k > 47 && k < 58))
  }

  ngOnInit() {
    localStorage.removeItem('login_user_info');
    localStorage.removeItem("usertype");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("usertype");
  }

  public onSubmit(values:any):void {
    if (this.form.valid) {
      let obj = {"phone": values.phone,"password": values.password};
      this.loginService.adminUser(obj).then(data => {
        if(data.success) {
          localStorage.setItem("admin_user",data.phone);
          localStorage.setItem("usertype",data.usertype);
          this.router.navigate(['admin/otplogin']);
        }else {
          this.alertService.createAlert(data.message,0);
        }
      }).catch(e => {
        console.log(e);
      });
      
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
