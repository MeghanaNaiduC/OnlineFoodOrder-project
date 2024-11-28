import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {

  public questionsArr: any[] = [];
  public answers: any[] = [];
  public remarks: any[] = [];
  public courseId: any = '';
  someKeyboardConfig: any = {

    pips: {
      mode: 'steps',
      stepped: false,
      density: 0
    },
    connect: [true, false],
    start: 0,
    keyboard: true,  // same as [keyboard]="true"
    step: 1, // number of page steps, defaults to 10
    range: {
      min: 0,
      max: 10
    },

  };

  constructor(public surveyService: SurveyService, public router: Router,
    public route: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit() {
    const questionsData = this.route.snapshot;
    this.questionsArr = questionsData.data['data'].result;
    this.courseId = this.route.snapshot.params['courseId'];
    console.log(this.courseId);
  }

  submitSurvey(form: NgForm) {
    const data = {};
    const answersArr = [];
    const remarksArr = [];
    if (this.answers) {
      this.answers.forEach((val, key) => {
        if (val !== undefined) {
          answersArr[key] = val;
        }
      });
    }

    if (this.remarks) {
      this.remarks.forEach((val, key) => {
        if (val !== undefined) {
          remarksArr[key] = val;
        }
      });
    }

    data['answers'] = answersArr;
    data['remarks'] = remarksArr;
    data['course_id'] = this.courseId;

    this.surveyService.submitSurvey(data).then(result => {
      if (result.success) {
        this.alertService.createAlert('Survey is done successfully', 1);
        this.router.navigate(['/']);
      } else {
        this.alertService.createAlert(result.message, 0);
      }
    });

   /* this.questionsArr.forEach((question, key) => {
      this.answers[question.question_id] = null;
      this.remarks[question.question_id] = null;
    });*/

  }
}
