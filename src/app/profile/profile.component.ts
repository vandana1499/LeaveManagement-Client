import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {leaveType} from "../leave_type";
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
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
enum EditMode {
  Event,
  Occurrence,
  Series
}

enum CrudOperation {
  Edit,
  Remove
}

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
  public formGroup: FormGroup;

  constructor(private route:ActivatedRoute,private modalService: NgbModal, public fb: FormBuilder,
    public editService: EditService) { 
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
          id: this.profiles.empId,
          isAllDay: true,
          recurrenceExceptions: null,
          recurrenceId: null, 
          recurrenceRule: null,
          start: new Date(this.leaveForm.get("from").value),
          startTimezone: undefined,
          title: this.leaveForm.get('leaveType').value,
        }
      )

      this.modalService.dismissAll()
      this.leaveForm.reset();
     
      
    }
    
  }
  get f(){
      return this.leaveForm.controls;
  }


  
  public slotDblClickHandler({ sender, start, end, isAllDay }: SlotClickEvent): void {
    this.closeEditor(sender);

    this.formGroup = this.fb.group({
        'Start': [start, Validators.required],
        'End': [end, Validators.required],
        'StartTimezone': new FormControl(),
        'EndTimezone': new FormControl(),
        'IsAllDay': isAllDay,
        'Title': new FormControl(''),
        'Description': new FormControl(''),
        'RecurrenceRule': new FormControl(),
        'RecurrenceID': new FormControl()
    });

    sender.addEvent(this.formGroup);
}

public eventDblClickHandler({ sender, event }: EventClickEvent): void {
  this.closeEditor(sender);

  let dataItem = event.dataItem;
  if (this.editService.isRecurring(dataItem)) {
      sender.openRecurringConfirmationDialog(CrudOperation.Edit)
          // The result will be undefined if the dialog was closed.
          .pipe(filter(editMode => editMode !== undefined))
          .subscribe((editMode: EditMode) => {
              if (editMode === EditMode.Series) {
                  dataItem = this.editService.findRecurrenceMaster(dataItem);
              }
              this.formGroup = this.createFormGroup(dataItem, editMode);
              sender.editEvent(dataItem, { group: this.formGroup, mode: editMode });
          });
  } else {
      this.formGroup = this.createFormGroup(dataItem, editMode);
      sender.editEvent(dataItem, { group: this.formGroup });
  }
}
public createFormGroup(dataItem: any, mode: EditMode): FormGroup {
  const isOccurrence = mode === EditMode.Occurrence;
  const exceptions = isOccurrence ? [] : dataItem.RecurrenceException;

  return this.fb.group({
      'Start': [dataItem.Start, Validators.required],
      'End': [dataItem.End, Validators.required],
      'StartTimezone': [dataItem.StartTimezone],
      'EndTimezone': [dataItem.EndTimezone],
      'IsAllDay': dataItem.IsAllDay,
      'Title': dataItem.Title,
      'Description': dataItem.Description,
      'RecurrenceRule': dataItem.RecurrenceRule,
      'RecurrenceID': dataItem.RecurrenceID,
      'RecurrenceException': [exceptions]
  });
}
public cancelHandler({ sender }: CancelEvent): void {
  this.closeEditor(sender);
}
public removeHandler({ sender, dataItem }: RemoveEvent): void {
  if (this.editService.isRecurring(dataItem)) {
      sender.openRecurringConfirmationDialog(CrudOperation.Remove)
            // The result will be undefined if the dialog was closed.
            .pipe(filter(editMode => editMode !== undefined))
            .subscribe((editMode) => {
                this.handleRemove(dataItem, editMode);
            });
  } else {
      sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
          if (shouldRemove) {
              this.editService.remove(dataItem);
          }
      });
  }
}

public saveHandler({ sender, formGroup, isNew, dataItem, mode }: SaveEvent): void {
  if (formGroup.valid) {
      const formValue = formGroup.value;

      if (isNew) {
          this.editService.create(formValue);
      } else {
          this.handleUpdate(dataItem, formValue, mode);
      }

      this.closeEditor(sender);
  }
}

public dragEndHandler({ sender, event, start, end, isAllDay }): void {
  let value = { Start: start, End: end, IsAllDay: isAllDay };
  let dataItem = event.dataItem;

  if (this.editService.isRecurring(dataItem)) {
      sender.openRecurringConfirmationDialog(CrudOperation.Edit)
          .pipe(filter(editMode => editMode !== undefined))
          .subscribe((editMode: EditMode) => {
              if (editMode === EditMode.Series) {
                  dataItem = this.editService.findRecurrenceMaster(dataItem);
                  value.Start = this.seriesDate(dataItem.Start, event.dataItem.Start, start);
                  value.End = this.seriesDate(dataItem.End, event.dataItem.End, end);
              } else {
                  value = { ...dataItem, ...value };
              }

              this.handleUpdate(dataItem, value, editMode);
          });
  } else {
      this.handleUpdate(dataItem, value);
  }
}
public resizeEndHandler({ sender, event, start, end }): void {
  let value = { Start: start, End: end };
  let dataItem = event.dataItem;

  if (this.editService.isRecurring(dataItem)) {
      sender.openRecurringConfirmationDialog(CrudOperation.Edit)
          .pipe(filter(editMode => editMode !== undefined))
          .subscribe((editMode: EditMode) => {
              if (editMode === EditMode.Series) {
                  dataItem = this.editService.findRecurrenceMaster(dataItem);
                  value.Start = this.seriesDate(dataItem.Start, event.dataItem.Start, start);
                  value.End = this.seriesDate(dataItem.End, event.dataItem.End, end);
              } else {
                  value = { ...dataItem, ...value };
              }

              this.handleUpdate(dataItem, value, editMode);
          });
  } else {
      this.handleUpdate(dataItem, value);
  }
}

private closeEditor(scheduler: SchedulerComponent): void {
  scheduler.closeEvent();

  this.formGroup = undefined;
}

private handleUpdate(item: any, value: any, mode?: EditMode): void {
  const service = this.editService;
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



  
}
