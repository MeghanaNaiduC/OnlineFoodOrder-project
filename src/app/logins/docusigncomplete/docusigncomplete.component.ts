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
  templateUrl: './docusigncomplete.component.html',
  styleUrls: ['./docusigncomplete.component.scss'],
  providers: [LoginService, AlertService],
})
export class DocuSignCompleteComponent implements OnInit {
  public settings: Settings;
  currentUser: any;
  
  constructor(private route: ActivatedRoute, public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (localStorage.getItem('login_user_info')) {
      this.currentUser = JSON.parse(localStorage.getItem('login_user_info'));
      let event = this.route.snapshot.queryParamMap.get('event');
      this.currentUser.contract_signed = (event == 'signing_complete') ? '1' : '0';
      this.updateAgreementStatus();
    } else {
      this.router.navigate(['/']);
    }
  }

  public updateAgreementStatus():void {
    if(this.currentUser && (this.currentUser.contract_signed == '1')) {
      let temp = {};
      temp['id'] = this.currentUser.courseId;
      temp['contract_signed'] = this.currentUser.contract_signed;
      this.loginService.updateCourseStatus(temp).then(res => {
        if (res.success) {
          this.alertService.createAlert('Contract signed successfully.', 1);
          this.router.navigate(['/']);
        } else {
          this.alertService.createAlert(res.message, 0);
          this.router.navigate(['/']);
        }
      });
    } else {
      this.alertService.createAlert('Contract sign failed.', 0);
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
