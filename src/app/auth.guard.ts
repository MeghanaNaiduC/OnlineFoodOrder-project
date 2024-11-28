import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router) { }
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('login_user_info')) {
      var data = JSON.parse(localStorage.getItem('login_user_info'));
      if(data.courseData.contract_signed)
        return true;
      else 
        return false;
    } else {
      return false;
    }
  }
}
