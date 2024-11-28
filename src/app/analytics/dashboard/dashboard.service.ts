import { Injectable, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { TabsetComponent } from 'ngx-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  addcategoryurl = '/addcategory';
  getcategoriesurl = '/getcategories';
  updateuserinfourl = '/updateuserinfo';
  addnewideaurl = '/addnewidea';
  getideasurl = '/getideas';
  updateideaurl = '/updateidea';
  getmenusectionsurl = '/getmenusections';
  getitemsurl = '/getItems';
  getmenucategoriesurl = '/getmenucategories';
  additemurl = '/additem';
  updatecategoryurl = '/updatecategory';
  updateitemurl = '/updateitem';
  deleteitemurl = '/deleteitem';
  deletecategoryurl = '/deletecategory';
  updatemenustatusurl = '/updatemenustatus';
  getprovincesurl = '/getstates';
  addcourseurl = '/addcourse';
  getcoursesurl = '/getcourses';
  updatecourseurl = '/updatecourse';
  updatecoursestatusurl = '/updatecoursestatus';
  getmemberrequestsurl = "/getmemberrequests";
  updaterequesturl = "/upgradetomember";
  getcourseordersurl = "/getcourseorders";
  generatememberinvoiceurl = "/generatememberinvoice";
  getsettingsurl = "/getsettings";
  updatesettingsurl = '/updatesettings';
  updatestatetaxesurl = '/updatestatetaxes';
  cancelSubscriptionUrl = '/cancel-subscription';
  getcountriesdropdownurl = '/getAllCountries';
  getcitiesdropdownurl = '/getcities';
  registercourseurl = '/registercourse';
  
  headers = new Headers({
    'Content-Type': 'application/json'
  });
  
  
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  
  constructor(private http: Http) { }
  
  getSettings(filter) : Promise <any> {
    return this.http.post(this.getsettingsurl, JSON.stringify(filter),{headers:this.headers, withCredentials: true}).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateSettings(Obj) : Promise<any> {
    return this.http.put(this.updatesettingsurl ,JSON.stringify(Obj), {headers:this.headers, withCredentials:true}).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateStatesTax(Obj) : Promise<any> {
    return this.http.put(this.updatestatetaxesurl ,JSON.stringify(Obj), {headers:this.headers, withCredentials:true}).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  
  addCategory(item): Promise<any> {
    
    return this.http.post(this.addcategoryurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  addCourse(finalObj): Promise<any> {
    
    return this.http.post(this.addcourseurl, JSON.stringify(finalObj), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateCategory(item): Promise<any> {
    
    return this.http.post(this.updatecategoryurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateCourse(course): Promise<any> {
    
    return this.http.post(this.updatecourseurl, JSON.stringify(course), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateCourseStatus(course): Promise<any> {
    
    return this.http.post(this.updatecoursestatusurl, JSON.stringify(course), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }

  updateIdea(course): Promise<any> {
    
    return this.http.put(this.updateideaurl, JSON.stringify(course), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateMenuStatus(type, item): Promise<any> {
    var data = {
      type: type,
      item: item
    };
    return this.http.post(this.updatemenustatusurl, JSON.stringify(data), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateItem(item): Promise<any> {
    
    return this.http.post(this.updateitemurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  registerCourse(item): Promise<any> {
    
    return this.http.post(this.registercourseurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  addNewIdea(item): Promise<any> {
    
    return this.http.post(this.addnewideaurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }

  getAllIdea(item): Promise<any> {
    
    return this.http.post(this.getideasurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  addItem(item): Promise<any> {
    
    return this.http.post(this.additemurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  deleteItem(item): Promise<any> {
    
    return this.http.post(this.deleteitemurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  deleteCategory(category): Promise<any> {
    
    return this.http.post(this.deletecategoryurl, JSON.stringify(category), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  updateUserInfo(item): Promise<any> {
    
    return this.http.put(this.updateuserinfourl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  getCategories(item): Promise<any> {
    
    return this.http.post(this.getcategoriesurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  getCourses(course): Promise<any> {
    
    return this.http.post(this.getcoursesurl, JSON.stringify(course), { headers: this.headers, withCredentials: true }).toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }
  
  verifyAddress(postalCode) {
    let api_key = 'AIzaSyAgDUII_kvGfCJNmu4qhhzjl8YNzblV9Ng';
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ postalCode+ "&sensor=false&key="+api_key+"").map(function(res){
    return res.json();
  });
}

getProvinces(province): Promise<any> {
  
  return this.http.post(this.getprovincesurl, JSON.stringify(province), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getCountriesDropdown(province): Promise<any> {
  
  return this.http.post(this.getcountriesdropdownurl, JSON.stringify(province), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getCitiesDropdown(province): Promise<any> {
  
  return this.http.post(this.getcitiesdropdownurl, JSON.stringify(province), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}


getItems(item): Promise<any> {
  
  return this.http.post(this.getitemsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getMemberRequests(item): Promise<any> {
  
  return this.http.post(this.getmemberrequestsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getCourseOrders(item): Promise<any> {
  
  return this.http.post(this.getcourseordersurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

generateMemberInvoice(item): Promise<any> {
  
  return this.http.post(this.generatememberinvoiceurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

updateRequest(item): Promise<any> {
  
  return this.http.post(this.updaterequesturl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getMenuSections(obj): Promise<any> {
  return this.http.post(this.getmenusectionsurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

getMenuCategories(obj): Promise<any> {
  return this.http.post(this.getmenucategoriesurl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
  .then(this.extractData)
  .catch(this.handleErrorPromise);
}

cancelSubscription(obj): Promise<any> {
  return this.http.post(this.cancelSubscriptionUrl, JSON.stringify(obj), { headers: this.headers, withCredentials: true }).toPromise()
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
