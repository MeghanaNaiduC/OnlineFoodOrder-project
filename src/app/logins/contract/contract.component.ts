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
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [LoginService, AlertService],
})
export class ContractComponent implements OnInit {
  public settings: Settings;
  currentUser: any;

  constructor(public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (localStorage.getItem('login_user_info')) {
      this.currentUser = JSON.parse(localStorage.getItem('login_user_info'));
    } else {
      this.router.navigate(['/']);
    }
  }

  public generateDocusignAuth():void {
    if(this.currentUser) {
      this.router.navigate(['/docusignauth']);
      /* this.loginService.generateDocusignAuth(this.currentUser.courseData).then(res => {
        if (res.success) {
          window.location.href=res.url;
        } else {
          this.alertService.createAlert(res.message, 0);
        }
      }); */
    } else {
      this.router.navigate(['/docusignauth']);
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
