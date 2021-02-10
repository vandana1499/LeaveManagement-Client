import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url="https://localhost:44353/"

  constructor(private http:HttpClient) { }

  getUserDetailsByEmpId(emp)
  {
    let fetchURL=this.url+'user/user-dashboard/'+emp;
    return this.http.get(fetchURL);
  }
}
