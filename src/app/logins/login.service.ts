import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {

  loginurl = "/login";
  forgetpassurl = "/forgotpassword";
  registeruserurl = "/registeruser";
  resetpassurl = '/resetpassword';
  checksessionurl = '/checksession';
  logouturl = "/logout";
  checkurlstatus = '/checkurlstatus';
  createpasswordurl = '/activateuser';
  checkresetpassurl = '/checkresetpassurlstatus';
  changepassurl = '/changepass';
  otpvalidateurl = '/validateotp';
  resetuserpasswordurl = '/resetuserpassword';
  updateuserurl = "/updateuser";
  changepasswordurl = "/changepassword";
  updateuserprofileurl = '/updateuserprofile';
  courseemailvalidationurl = '/courseemailvalidator';
  superadminloginurl = '/superadminlogin';
  adminotpvalidateurl = '/adminvalidateotp';
  setpasswordurl = '/setpassword';
  getupdateduserurl = '/getCourseData';
  generatedocusignauthurl = '/generatedocusignauth';
  generatedocusignurl = '/generatedocusign';
  updatecoursestatusurl = '/updatecoursestatus';
  

  headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('sg_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('sg_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  updateUser(item) : Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateuserurl, JSON.stringify(item), {headers:this.headers, withCredentials:true}).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }

  
  changePassword(item) : Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.changepasswordurl, JSON.stringify(item), {headers:this.headers, withCredentials:true}).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  loginCheck(uname, pswd): Promise<any> {
    var data = {
      phone: uname,
      password: pswd
    }
    return this.http.post(this.loginurl, JSON.stringify(data), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateCourseStatus(course): Promise<any> {

    return this.http.post(this.updatecoursestatusurl, JSON.stringify(course), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  registerUser(obj): Promise<any> {
    return this.http.post(this.registeruserurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  adminUser(obj): Promise<any> {
    return this.http.post(this.superadminloginurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  checkEmail(obj): Promise<any> {
    return this.http.post(this.courseemailvalidationurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateUserProfile(obj): Promise<any> {
    return this.http.post(this.updateuserprofileurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
  

  logOut(): Promise<any> {
    return this.http.post(this.logouturl, { headers: this.headers}).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
  
  forgetPassword(number): Promise<any> {
    var data = {
      phone: number
    }
    return this.http.post(this.forgetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  validateOTP(obj): Promise<any> {
    return this.http.post(this.otpvalidateurl, JSON.stringify(obj), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  validateAdminOTP(obj): Promise<any> {
    return this.http.post(this.adminotpvalidateurl, JSON.stringify(obj), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  resetUserPassword(obj): Promise<any> {
    return this.http.post(this.resetuserpasswordurl, JSON.stringify(obj), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
  
  getUpdatedUserInfo(obj): Promise<any> {
    return this.http.post(this.getupdateduserurl, JSON.stringify(obj), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  setpassword(pswd, uid, resetToken): Promise<any> {
    var data = {
      userId: uid,
      password: pswd,
      accessToken: resetToken
    }
    return this.http.post(this.setpasswordurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
  
  generateDocusignAuth(user): Promise<any> {
    return this.http.post(this.generatedocusignauthurl, JSON.stringify(user), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  generateDocusign(user): Promise<any> {
    return this.http.post(this.generatedocusignurl, JSON.stringify(user), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
 
  resetPassword(pswd, uid, resetToken): Promise<any> {
    var data = {
      userId: uid,
      password: pswd,
      accessToken: resetToken
    }
    return this.http.post(this.resetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  checkSessionAlive(token) {
    let headers2 = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.checksessionurl, { headers: headers2, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  urlStatusCheck(uid, accessToken): Promise<any> {
    var data = {
      userId: uid,
      accessToken: accessToken
    }
    return this.http.post(this.checkurlstatus, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  userCreatePassword(pswd, uid, accToken): Promise<any> {
    var data = {
      userId: uid,
      password: pswd,
      accessToken: accToken
    }
    return this.http.post(this.createpasswordurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  urlResetPasswordCheck(uid, accessToken, tS): Promise<any> {
    var data = {
      userId: uid,
      accessToken: accessToken,
      timeStamp: tS
    }
    return this.http.post(this.checkresetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleErrorPromise(error: Response | any) {
   
    return Promise.reject(error.message || error);
  }

}
