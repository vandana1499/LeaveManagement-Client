import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { routes } from './admin/admin-routing.module';
import { HttpService } from './http/http.service';
import { Profile } from "./profile"

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<Profile> {
  constructor(private http: HttpService) {

  }
  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> {
    let emp = localStorage.getItem('empid');
    console.log(emp);
    return this.http.getUserDetailsByEmpId(emp);
  }
}
