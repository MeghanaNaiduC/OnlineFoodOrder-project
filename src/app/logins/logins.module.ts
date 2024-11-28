import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component'; 
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { UserActivateComponent } from './useractivate/useractivate.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {TooltipModule} from "ngx-tooltip";
import { RegisterComponent } from './register/register.component';
import { OtpverificationComponent } from './otpverification/otpverification.component';
import { ContractComponent } from './contract/contract.component';
import { DocuSignAuthComponent } from './docusignauth/docusignauth.component';
import { DocuSignCompleteComponent } from './docusigncomplete/docusigncomplete.component';
import { LoginService } from './login.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

export const routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent, data: { breadcrumb: 'Login' } },
  {path:'forgotpassword' , component: ForgotpasswordComponent },
  {path:'resetpassword', component: ResetpasswordComponent},
  {path:'setpassword', component: UserActivateComponent},
  {path:'register', component: RegisterComponent},
  {path:'otpverification', component: OtpverificationComponent},
  {path:'contract', component: ContractComponent},
  {path:'docusignauth', component:DocuSignAuthComponent },
  {path:'docusigncomplete', component:DocuSignCompleteComponent }
]

@NgModule({
  declarations: [ForgotpasswordComponent, DocuSignCompleteComponent,
    DocuSignAuthComponent, ContractComponent, ResetpasswordComponent,
    LoginComponent, UserActivateComponent, RegisterComponent, OtpverificationComponent],
  imports: [
    CommonModule,
    TooltipModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [LoginService, CookieService]
})
export class LoginsModule { }
