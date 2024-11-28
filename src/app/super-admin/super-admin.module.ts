import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from "ngx-tooltip";
import { SharedModule } from '../shared/shared.module';
import { OtploginComponent } from './otplogin/otplogin.component';
import { SuperAdminComponent } from './super-admin.component';
import { CoursesComponent } from './courses/courses.component';
import { OrdersComponent } from './orders/orders.component';
import { FeesComponent } from './fees/fees.component';
import { TaxesComponent } from './taxes/taxes.component';
import { ContractComponent } from './contract/contract.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ResetpasswordComponent } from '../logins/resetpassword/resetpassword.component';
import { ResetPasswordDialogComponent } from './courses/reset-password-dialog/reset-password-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxEditorModule } from 'ngx-editor';
import { SurveysComponent } from './surveys/surveys.component';
import { MatExpansionModule } from '@angular/material';
import { SurveyResolver } from '../survey/survey-form/survey.resolver';
import { SurveyService } from '../survey/survey.service';
import { NouisliderModule } from 'ng2-nouislider';
import { AddNewCourseComponent } from './add-new-course/add-new-course.component';
import { IdeaLogComponent } from './idea-log/idea-log.component';
import { AddIdeaComponent } from './idea-log/add-idea/add-idea.component';


export const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SuperAdminComponent, data: { breadcrumb: 'Login' } },
  { path: 'otplogin', component: OtploginComponent },
  { path: 'courses', component: CoursesComponent, data: { breadcrumb: 'Manage Courses' } },
  { path: 'orders', component: OrdersComponent, data: { breadcrumb: 'Member Orders' } },
  { path: 'fees', component: FeesComponent, data: { breadcrumb: 'Subscription Fees' } },
  { path: 'contracts', component: ContractComponent, data: { breadcrumb: 'Contract' } },
  { path: 'taxes', component: TaxesComponent, data: { breadcrumb: 'Taxes' } },
  { path: 'idea-log', component: IdeaLogComponent, data: { breadcrumb: 'Idea-Log' } },
  {
    path: 'surveys/:courseId/:courseName', component: SurveysComponent, data: { breadcrumb: 'Surveys' },
    resolve: {
      data: SurveyResolver,
    }
  },
];

@NgModule({
  declarations: [OtploginComponent, SuperAdminComponent, CoursesComponent, OrdersComponent,
    FeesComponent, AddCourseComponent, ResetPasswordDialogComponent, TaxesComponent, ContractComponent, SurveysComponent, AddNewCourseComponent, IdeaLogComponent, AddIdeaComponent],
  imports: [
    NgxEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    ConfirmationPopoverModule,
    TooltipModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatExpansionModule,
    NouisliderModule
  ],
  entryComponents: [AddCourseComponent, ResetPasswordDialogComponent,AddNewCourseComponent,AddIdeaComponent],
  providers: [SurveyService, SurveyResolver]
})
export class SuperAdminModule { }
