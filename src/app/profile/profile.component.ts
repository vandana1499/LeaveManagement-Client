import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {leaveType} from "../leave_type";
import { CrudOperation, EditMode, SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { sampleData, displayDate } from './event.utc';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,Validators,FormControl, FormGroup} from "@angular/forms"

import '@progress/kendo-date-math/tz/regions/Europe';
import '@progress/kendo-date-math/tz/regions/NorthAmerica';
import { filter } from 'rxjs/operators';

import { EditService } from './edit.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profiles;
  leaveType=leaveType;
  closeResult = '';
  leaveForm=this.fb.group({
    leaveType:['',Validators.required],
    from:['',Validators.required],
    to:['',Validators.required]
  })
  editEnable;
  public formGroup: FormGroup;

  constructor(private route:ActivatedRoute,private modalService: NgbModal, public fb: FormBuilder,
    public editService: EditService) { 
    this.route.data.subscribe(data=>{
      console.log(data)
      this.profiles=data['data'];
    })
    console.log(this.profiles)
    this.editEnable=false;
  }
  public selectedDate: Date = displayDate;
  public events = sampleData;

  ngOnInit(): void {

  }
  open(content) {
    this.modalService.open(content,{ariaLabelledBy: 'modal-basic-title',centered:true}).result.then((result) => {
      this.closeResult = `Closed`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }
 
  onSubmit()
  {
    console.log("on submit ")
    console.log(this.events)
    if(!this.leaveForm.invalid)
    {
      this.events.push(
        {
          end: new Date(this.leaveForm.get("to").value),
          id: this.profiles.empId,
          isAllDay: true,
          start: new Date(this.leaveForm.get("from").value),
          title: this.leaveForm.get('leaveType').value,
          ownerID:this.profiles.empId
        }
      )
      this.modalService.dismissAll()
      this.leaveForm.reset();
    }
    
  }
  onEditSubmit()
  {
    console.log("On edit submit")
    if(!this.leaveForm.invalid)
    {
      console.log(this.leaveForm.value);
      console.log(this.events)
      var start=this.leaveForm.get('from').value;
      var end=this.leaveForm.get('to').value;
      // this.events.forEach((ele,index) => {
      //   if(start===ele.start && end === ele.end)
      //   {
      //     ele.
      //   }
      // });
      // this.events.push(
      //   {
      //     end: new Date(this.leaveForm.get("to").value),
      //     id: this.profiles.empId,
      //     isAllDay: true,
      //     start: new Date(this.leaveForm.get("from").value),
      //     title: this.leaveForm.get('leaveType').value,
      //   }
      // )

      this.modalService.dismissAll()
      this.leaveForm.reset();
     
      
    }
  }
 
  get f(){
      return this.leaveForm.controls;
  }


enableEdit()
{
  this.editEnable=true;
}
enableManage()
{
  this.editEnable=false
}



  
}
