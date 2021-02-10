import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,Validators} from "@angular/forms"
import {HttpService} from "../../../http/http.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpService,private fb:FormBuilder,private router:Router) { }

  loginForm=this.fb.group({
    emp:['',Validators.required],
    password:['',Validators.required]
  })

  onSubmit()
  {
    if(!this.loginForm.invalid)
    {
      console.log(this.loginForm.value);
      localStorage.setItem('empid',this.loginForm.get('emp').value);
      this.router.navigate(['/user-dashboard'])
    }
    
  }
  get f(){
    return this.loginForm.controls;
  }

  
  ngOnInit(): void {
  }
  
  

}
