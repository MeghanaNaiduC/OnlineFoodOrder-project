import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../login.service'
import { AlertService } from '../../shared/services/alert.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`.input-group-addon {
    padding: 0px !important;
    font-size: 14px;
    font-weight: 400;
    line-height: 0;
    color: #555;
    text-align: center;
    border: 0px;
    border-radius: 0px;
    background-color: transparent;
}`],
  providers: [LoginService, AlertService, CookieService],
})

export class LoginComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  show: boolean;
  public moduleUrls: any = {
    "Dashboard": "/salesglobal/analytics/dashboard",
    "Task Manager": "/salesglobal/analytics/taskmanager/prospects",
    "Campaigns": "/salesglobal/marketing/campaigns/gridview",
    "Leads": "/salesglobal/marketing/leads/gridview",
    "Prospects": "/salesglobal/marketing/prospects",
    "Contacts": "/salesglobal/marketing/contacts",
    "Accounts": "/salesglobal/sales/accounts/gridview",
    "Referral": "/salesglobal/referral",
    "Calendar": "/salesglobal/calender",
    "Kanban": "/salesglobal/admin/steps/prospects",
    "Lookup": "/salesglobal/admin/lookup",
    "Settings": "/salesglobal/admin/settings",
    "Users": "/salesglobal/admin/users",
    "Checklist": "/salesglobal/admin/checklist",
    "Color Codes": "/salesglobal/admin/colorcode",
    "Locations": "/salesglobal/admin/location",
    "Permissions": "/salesglobal/admin/users/permissions",
    "Opportunities": "/salesglobal/sales/opportunities"
  };

  constructor(public _cookieService: CookieService, public appSettings: AppSettings, public fb: FormBuilder, public router: Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings;
    this.show = false;
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'rememberMe': false
    });

    if (_cookieService.get('rememberMe')) {
      this.form.controls['email'].setValue(this._cookieService.get('email'));
      this.form.controls['password'].setValue(this._cookieService.get('password'));
      this.form.controls['rememberMe'].setValue(this._cookieService.get('rememberMe'));
    }
  }


  ngOnInit() {
    if (localStorage.getItem('login_user_info')) {
      localStorage.removeItem('login_user_info');
      localStorage.removeItem("usertype");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("usertype");
       var currentUser = JSON.parse(localStorage.getItem('login_user_info'));
      let token = currentUser.token;
      this.loginService.checkSessionAlive(token).then(res => {
        if (res.success) {
          this.router.navigate(['/oFo/locations']);
        }
      }); 
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 47 && k < 58))
  }


  public onSubmit(values: any): void {
    if (this.form.valid) {
      this.loginService.loginCheck(values.email, values.password).then(res => {
        if (res.auth) {
          let per_data = res;
          let flag = true;
          console.log(res);
          localStorage.setItem('login_user_info', JSON.stringify({
            _id: res.id, email: res.email, name: res.name,
            phone: res.phone, address: res.address, cityName: res.users.tbl_city.name, city: res.users.tbl_city.id,  country: res.country, stateName: res.users.tbl_state.name, state: res.users.tbl_state.id, zip: res.zip, url: res.url,menuData:res.users.tbl_menu_sections,
            courseName: res.courseName, courseId: res.courseId, courseData: res.courseData, stateRes : res.users.tbl_province
          }));
          localStorage.setItem("usertype",'user');
           this.router.navigate(['/oFo/locations']);
        }
         else {
          this.alertService.createAlert(res.message, 0);
        }
      }).catch(e => {
        console.log(e);
      });
      if (values['rememberMe'] == true) {
        //Sending the values to cookieservice (input values => cookie service)
        this._cookieService.put('email', values['email']);
        this._cookieService.put('password', values['password']);
        this._cookieService.put('rememberMe', values['rememberMe']);
      }

      //deleting values if unselected for remember password
      if (values['rememberMe'] == false) {
        this._cookieService.remove('email', values['email']);
        this._cookieService.remove('password', values['password']);
        this._cookieService.remove('rememberMe', values['rememberMe']);
      }
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
