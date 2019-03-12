import { Component, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
} from "@angular/material";
import { Teacher } from 'src/app/_models/teacher';
import { TeacherService } from './teacher.service';
import { CourseService } from '../course/course.service';
import { ClassService } from '../class/class.service';
import { Course } from '../../_models/course';
import { Class } from '../../_models/class';
import * as _ from 'underscore';
import { TeacherSchedule } from 'src/app/_models/teacherSchedule';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  scheduleOpenState = false;
  listTeachers: Teacher[] = [];
  listSchedules: TeacherSchedule[] = [];
  isCreating = false;
  isEdit = false;
  isRegister = false;
  selectedTeacher = "";
  listCourses: Course[] = [];
  listClasses: Class[] = [];

  // Form Group
  createForm: FormGroup;
  registerForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "id",
    "name",
    "birth",
    "gender",
    "phone",
    "email",
    "salary",
    "option"
  ];
  scheduleColumns: string[] = [
    "teacherName",
    "courseName",
    "className",
    "startTime",
    "endTime",
  ];
  listGenders: string[] = [
    "Male",
    "Female",
    "Uncheck"
  ]
  dataSource = new MatTableDataSource<Teacher>();
  scheduleSource = new MatTableDataSource<TeacherSchedule>();
  selection = new SelectionModel<Teacher>(true, []);
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

  constructor(private _teacherService: TeacherService, private _formBuilder: FormBuilder,
              private _courseService: CourseService, private _classService: ClassService, 
              public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required],
      birth: ['', Validators.required],
      gender: ['Male', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      salary: ['', Validators.required]
    });
    this.registerForm = this._formBuilder.group({
      teacher: ['', Validators.required],
      course: ['', Validators.required],
      class: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    })
    this.getAllTeachers();
  }

  getAllTeachers() {
    this._teacherService.getAllTeachers().subscribe(success => {
      this.listTeachers = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Teacher>(this.listTeachers);
      this.openSnackBar("Success", "Teachers loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Teachers");
    });
  }

  addTeacher() {
    if (!this.createForm.controls.email.value.includes("@")) {
      this.openSnackBar("Warming", "Email format: example@example.com");
      return;
    }
    let body = {
      name: this.createForm.controls.name.value,
      birth: this.createForm.controls.birth.value,
      gender: this.createForm.controls.gender.value,
      phone: this.createForm.controls.phone.value,
      email: this.createForm.controls.email.value,
      salary: this.createForm.controls.salary.value
    }
    this._teacherService.addTeacher(body).subscribe(
      success => {
        this.listTeachers.push(success.body as Teacher);
        this.dataSource = new MatTableDataSource<Teacher>(this.listTeachers);
        this.isCreating = false;
        this.panelOpenState = true;
        this.openSnackBar("Success", `Add ${this.createForm.controls.name.value} successfully`);
      },
      err => {
        this.openSnackBar("Failed", `Add ${this.createForm.controls.name.value} failure`);
      }
    )
  }

  editTeacher() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
      birth: this.createForm.controls.birth.value,
      gender: this.createForm.controls.gender.value,
      phone: this.createForm.controls.phone.value,
      email: this.createForm.controls.email.value,
      salary: this.createForm.controls.salary.value
    }

    this._teacherService.updateTeacher(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update ${this.createForm.controls.name.value} successfully`);
        let index = this.listTeachers.indexOf(body);
        let itemIndex = this.listTeachers.findIndex(item => item.id == body.id);
        this.listTeachers[itemIndex] = body as Teacher;
        this.dataSource = new MatTableDataSource<Teacher>(this.listTeachers);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
      },
      err => {
        this.openSnackBar("Failed", `Update ${this.createForm.controls.name.value} failure`);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
      }
    )
  }

  showRegisterForm(element: any) {
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = false;
    this.isRegister = true;
    this.registerForm.reset();

    this._courseService.getAllCourse().subscribe(success => {
      this.listCourses = _.sortBy(success);
      this.registerForm.controls.teacher.setValue(element);
      this._classService.getAllClass().subscribe(classes => {
        this.listClasses = _.sortBy(classes);
      })
    },
    err => {
      this.openSnackBar("Failed", "Failed to get Courses list");
    })
  }

  compareFn(option1, option2){
    if (option1 != null && option2 != null) 
      return option1.name === option2.name;
  }

  showCreateForm() {
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = true;
    this.isEdit = false;

    this.createForm.controls.gender.setValue("Male");
  }

  showEditForm(element: any) {
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;

    this.createForm.controls.id.setValue(element['id']);
    this.createForm.controls.name.setValue(element['name']);
    this.createForm.controls.birth.setValue(element['birth']);
    this.createForm.controls.gender.setValue(element['gender']);
    this.createForm.controls.phone.setValue(element['phone']);
    this.createForm.controls.email.setValue(element['email']);
    this.createForm.controls.salary.setValue(element['salary']);
    
  }

  deleteTeacher(element: any) {
    this._teacherService.deleteTeacher(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete ${element.name} successfully`);
        const index = this.listTeachers.findIndex(teacher => teacher.id == element.id);
        if (index > -1) {
          this.listTeachers.splice(index, 1);
          this.dataSource = new MatTableDataSource<Teacher>(this.listTeachers);
        }
      },
      err => {
        this.openSnackBar("Failed", `Cannot delete ${element.name}`);
      }
    )
  }

  showSchedule(element: any) {
    this.selectedTeacher = element;
    this.panelOpenState = false;
    this.scheduleOpenState = true;

    this._teacherService.getScheduleByTeacherId(element.id).subscribe(success => {
      this.listSchedules = success;
      this.scheduleSource = new MatTableDataSource<TeacherSchedule>(this.listSchedules);
    })
  }

  goBack() {
    this.panelOpenState = true;
    this.scheduleOpenState = false;
  }

  cancel() {
    this.isCreating = false;
    this.isEdit = false;
    this.isRegister = false;
    this.panelOpenState = true;
  }

  clear() {
    this.createForm.reset();
  }

  openSnackBar(alert: string, message: string) {
    this.snackBar.open(alert, message, { duration: 2000 });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openConfirmDialog(element: any): void {
    const dialogRef = this.dialog.open(ConfirmTeacherDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteTeacher(element);
    });
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmTeacherDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmTeacherDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}

