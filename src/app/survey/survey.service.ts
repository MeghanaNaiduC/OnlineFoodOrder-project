import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    getQuestionsurl = '/get-survey-questions';
    submitSurveyUrl = '/submit-survey';
    getCourseSurveysUrl = '/get-course-surveys';

    headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http) { }

    getQuestions(): Promise<any> {
        return this.http.get(this.getQuestionsurl, { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    submitSurvey(data): Promise<any> {
        return this.http.post(this.submitSurveyUrl, JSON.stringify(data), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getCourseSurveys(data): Promise<any> {
        return this.http.post(this.getCourseSurveysUrl, JSON.stringify(data), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }
    private handleErrorPromise(error: Response | any) {

        return Promise.reject(error.message || error);
    }

}
