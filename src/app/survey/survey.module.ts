import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/primeng';
import { MatRadioModule, MatCardModule, MatFormFieldModule } from '@angular/material';
import { SurveyResolver } from './survey-form/survey.resolver';
import { NouisliderModule } from 'ng2-nouislider';

export const routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: 'index/:courseId', component: SurveyFormComponent, data: { breadcrumb: 'Login' },
    resolve: {
      data: SurveyResolver,
    }
  }
];

@NgModule({
  declarations: [SurveyFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    NouisliderModule
  ],
  providers: [SurveyResolver]
})
export class SurveyModule { }
