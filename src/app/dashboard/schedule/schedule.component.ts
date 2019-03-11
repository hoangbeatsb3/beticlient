import { Component, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormControl , ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
} from "@angular/material";
import { Schedule } from 'src/app/_models/schedule';
import { ScheduleService } from './shedule.service';
import * as _ from 'underscore';
import { Subject } from 'src/app/_models/subject';
import { TeacherService } from '../teacher/teacher.service';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  listSchedules: Schedule[] = [];
  listDetail: Schedule[] = [];
  isCreating = false;
  isEdit = false;
  selectedSchedule = "";
  listTeachers: any[] = [];
  listSubjects: Subject[] = [];
  listClassName: string[] = [];

  // Form Group
  createForm: FormGroup;
  registerForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "teacherName",
    "subjectName",
    "className",
    "startTime",
    "endTime",
    "option"
  ];

  // Data Source
  dataSource = new MatTableDataSource<Schedule>();
  detailSource = new MatTableDataSource<Schedule>();
  selection = new SelectionModel<Schedule>(true, []);
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator && this.sort) {
      this.applyFilter("");
    }
  }

  constructor(private _scheduleService: ScheduleService, private _teacherService: TeacherService, 
              private _formBuilder: FormBuilder, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllSchedules();
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      className: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      subject: ['', Validators.required],
      teacher: ['', Validators.required]
    });
  }

  getAllSchedules() {
    this._scheduleService.getAllSchedule().subscribe(success => {
      success.map(schedule => {
        schedule.startTime = moment(schedule.startTime).local().format("YYYY-MM-DD HH:mm:ss");
        schedule.endTime = moment(schedule.endTime).local().format("YYYY-MM-DD HH:mm:ss");
        this.listClassName.push(schedule.className);
        this.listClassName.push(schedule.className);
      })
      this.listClassName =  Array.from(new Set(this.listClassName));
      this.listSchedules = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Schedule>(this.listSchedules);
      this._teacherService.getAllTeachers().subscribe(success => {
        this.listTeachers = success;
      });
      this.openSnackBar("Success", "Schedules loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Schedules");
    });
  }

  addSchedule() {
    let body = {
      id: {
        teacherId: this.createForm.controls.teacher.value.id,
        subjectId: this.createForm.controls.subject.value.id,
      },
      teacher: this.createForm.controls.teacher.value,
      subject: this.createForm.controls.subject.value,
      className: this.createForm.controls.className.value,
      startTime: moment(this.createForm.controls.startTime.value).utc().format(),
      endTime: moment(this.createForm.controls.endTime.value).utc().format(),
    }
    this._scheduleService.addSchedule(body).subscribe(
      success => {
        body.startTime = moment(body.startTime).local().format("YYYY-MM-DD HH:mm:ss");
        body.endTime = moment(body.endTime).local().format("YYYY-MM-DD HH:mm:ss");
        this.listSchedules.push(success.body as Schedule);
        this.dataSource = new MatTableDataSource<Schedule>(this.listSchedules);
        this.isCreating = false;
        this.panelOpenState = true;
        this.detailOpenState = false;
        this.openSnackBar("Success", `Add successfully`);
      },
      err => {
        this.openSnackBar("Failed", `Add failure`);
      }
    )
  }

  editSchedule() {
    let body = {
      id: {
        teacherId: this.createForm.controls.teacher.value.id,
        subjectId: this.createForm.controls.subject.value.id,
      },
      teacher: this.createForm.controls.teacher.value,
      subject: this.createForm.controls.subject.value,
      className: this.createForm.controls.className.value,
      startTime: moment(this.createForm.controls.startTime.value).utc().format(),
      endTime: moment(this.createForm.controls.endTime.value).utc().format(),
    }
    this._scheduleService.updateSchedule(body).subscribe(
      success => {
        body.startTime = moment(body.startTime).local().format("YYYY-MM-DD HH:mm:ss");
        body.endTime = moment(body.endTime).local().format("YYYY-MM-DD HH:mm:ss");
        let itemIndex = this.listSchedules.findIndex(item => item.id == body.id);
        this.listSchedules[itemIndex] = body as Schedule;
        this.dataSource = new MatTableDataSource<Schedule>(this.listSchedules);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
        this.openSnackBar("Success", `Update successfully`);
      },
      err => {
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
        this.openSnackBar("Failed", `Update failure`);
      }
    )
  }

  showCreateForm() {
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = true;
    this.isEdit = false;
    this.detailOpenState = false;
  }

  showEditForm(element: any) {
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
    this.createForm.controls.id.setValue(element.id);
    this.createForm.controls.teacher.setValue(element.teacher);
    this.createForm.controls.subject.setValue(element.subject);
    this.createForm.controls.className.setValue(element.className);
    this.createForm.controls.startTime.setValue(element.startTime);
    this.createForm.controls.endTime.setValue(element.endTime);
  }

  compareFn(option1, option2){
    return option1.name === option2.name;
  }

  deleteSchedule(element: any) {
    this._scheduleService.deleteSchedule(element.teacher.id, element.subject.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete successfully`);
        const index = this.listSchedules.findIndex(schedule => schedule.teacher.id == element.teacher.id && schedule.subject.id == element.subject.id);
        if (index > -1) {
          this.listSchedules.splice(index, 1);
          this.dataSource = new MatTableDataSource<Schedule>(this.listSchedules);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Please delete all subject in first`);
      }
    )
  }

  cancel() {
    this.isCreating = false;
    this.isEdit = false;
    this.panelOpenState = true;
    this.detailOpenState = false;
  }

  clear() {
    this.createForm.reset();
  }

  goBack() {
    this.detailOpenState = false;
    this.panelOpenState = true;
  }

  openSnackBar(alert: string, message: string) {
    this.snackBar.open(alert, message, { duration: 2000 });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openConfirmDialog(element: any): void {
    const dialogRef = this.dialog.open(ConfirmScheduleDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteSchedule(element);
    });
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmScheduleDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmScheduleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}


