import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../login.service'
import { AlertService } from '../../shared/services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blank',
  templateUrl: './docusignauth.component.html',
  styleUrls: ['./docusignauth.component.scss'],
  providers: [LoginService, AlertService],
})
export class DocuSignAuthComponent implements OnInit {
  public settings: Settings;
  currentUser: any;
  
  constructor(private route: ActivatedRoute, public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (localStorage.getItem('login_user_info')) {
      this.currentUser = JSON.parse(localStorage.getItem('login_user_info'));
      //this.currentUser.authKey = this.route.snapshot.queryParamMap.get('code');
      this.initiateDocusign();
    } else {
      this.router.navigate(['/']);
    }
  }

  public initiateDocusign():void {
    if(this.currentUser) {
      this.loginService.generateDocusign(this.currentUser).then(res => {
        if (res.success) {
          window.location.href=res.url;
        } else {
          this.alertService.createAlert(res.message, 0);
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
