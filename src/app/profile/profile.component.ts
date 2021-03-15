import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {leaveType} from "../leave_type";
import { CrudOperation, EditMode, SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { sampleData, displayDate } from './event.utc';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder,Validators,FormControl, FormGroup} from "@angular/forms"
import {
  CancelEvent,
  EventClickEvent,
  RemoveEvent,
  SaveEvent,
  SchedulerComponent,
  SlotClickEvent
} from '@progress/kendo-angular-scheduler';
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


  
 




public removeHandler({ sender, dataItem }: RemoveEvent): void {
 
      sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
          if (shouldRemove) {
              this.editService.remove(dataItem);
          }
      });
  
}



public dragEndHandler({ sender, event, start, end, isAllDay }): void {
  let value = { Start: start, End: end, IsAllDay: isAllDay };
  let dataItem = event.dataItem;
      this.handleUpdate(dataItem, value);
  
}
public resizeEndHandler({ sender, event, start, end }): void {
  let value = { Start: start, End: end };
  let dataItem = event.dataItem;

 
      this.handleUpdate(dataItem, value);
  
}


private handleUpdate(item: any, value: any, mode?: EditMode): void {
  const service = this.editService;
  console.log(this.editService)
  console.log(service)
  if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
          service.update(item, value);
      } else {
          service.createException(item, value);
      }
  } else {
      // The item is non-recurring or we are editing the entire series.
      service.update(item, value);
  }
}

private handleRemove(item: any, mode: EditMode): void {
  const service = this.editService;
  if (mode === EditMode.Series) {
      service.removeSeries(item);
  } else if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
          service.remove(item);
      } else {
          service.removeOccurrence(item);
      }
  } else {
      service.remove(item);
  }
}
private seriesDate(head: Date, occurence: Date, current: Date): Date {
  const year = occurence.getFullYear() === current.getFullYear() ? head.getFullYear() : current.getFullYear();
  const month = occurence.getMonth() === current.getMonth() ? head.getMonth() : current.getMonth();
  const date = occurence.getDate() === current.getDate() ? head.getDate() : current.getDate();
  const hours = occurence.getHours() === current.getHours() ? head.getHours() : current.getHours();
  const minutes = occurence.getMinutes() === current.getMinutes() ? head.getMinutes() : current.getMinutes();

  return new Date(year, month, date, hours, minutes);
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
