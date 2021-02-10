import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {leaveType} from "../leave_type";
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { sampleData, displayDate } from './event.utc';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,Validators} from "@angular/forms"

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
  constructor(private route:ActivatedRoute,private modalService: NgbModal,private fb:FormBuilder) { 
    this.route.data.subscribe(data=>{
      console.log(data)
      this.profiles=data['data'];
    })
    console.log(this.profiles)
  }
  public selectedDate: Date = displayDate;
  public events: SchedulerEvent[] = sampleData;

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
    if(!this.leaveForm.invalid)
    {
      console.log(this.leaveForm.value);
      console.log(this.events)
      this.events.push(
        {
          end: new Date(this.leaveForm.get("to").value),
          endTimezone: undefined,
          id: this.profiles.empId,
          isAllDay: true,
          recurrenceExceptions: null,
          recurrenceId: null, 
          recurrenceRule: null,
          start: new Date(this.leaveForm.get("from").value),
          startTimezone: undefined,
          title: this.leaveForm.get('leaveType').value
        }
      )
      this.modalService.dismissAll()
     
      
    }
    
  }
  get f(){
      return this.leaveForm.controls;
  }
  
}
