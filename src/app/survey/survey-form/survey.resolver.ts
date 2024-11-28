import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Resolve } from '@angular/router';
import { SurveyService } from '../survey.service';
import { Observable } from 'rxjs';

@Injectable()
export class SurveyResolver implements Resolve<any> {
    encodedId: any;
    company_id: any;
    candidate: any;

    constructor(
        private surveyService: SurveyService,
        private router: Router,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        return this.surveyService.getQuestions();
    }

}
