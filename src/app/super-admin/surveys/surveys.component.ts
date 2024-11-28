import { Component, OnInit } from '@angular/core';
import { SurveyService } from 'src/app/survey/survey.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {
  panelOpenState = false;
  public questionsArr: any[] = [];
  public surveys: any[] = [];
  public answers: any[] = [];
  public courseId: any = null;
  public courseName: any = null;
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
  constructor(public surveyService: SurveyService, public route: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit() {
    const questionsData = this.route.snapshot;
    this.questionsArr = questionsData.data['data'].result;
    this.courseId = atob(this.route.snapshot.params['courseId']);
    this.courseName = atob(this.route.snapshot.params['courseName']);
    const data = {};
    data['courseId'] = this.courseId;
    this.surveyService.getCourseSurveys(data).then(result => {
      if (result.success && Object.keys(result.result).length) {
        this.surveys = result.result;
      }
    });

  }

}
