import { Component, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
} from "@angular/material";
import { Student } from 'src/app/_models/student';
import { StudentService } from './student.service';
import * as _ from 'underscore';
import { Mark } from 'src/app/_models/mark';
import { Course } from '../../_models/course';
import { Class } from '../../_models/class';
import { CourseService } from '../course/course.service';
import { MarkService } from '../mark/mark.service';
import { ClassService } from '../class/class.service';
import { StudentSchedule } from 'src/app/_models/studentSchedule';
import * as moment from 'moment';
declare let jsPDF;

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})
export class StudentComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  scheduleOpenState = false;
  listStudents: Student[] = [];
  listCourses: Course[] = [];
  listClasses: Class[] = [];
  listDetail: Mark[] = [];
  listSchedules: StudentSchedule[] = [];
  isCreating = false;
  isEdit = false;
  isRegister = false;
  selectedStudent: Student;

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
    "title",
    "option"
  ];
  detailColumns: string[] = [
    "studentName",
    "courseName",
    "term",
    "mark",
    "option"
  ];
  scheduleColumns: string[] = [
    "studentName",
    "courseName",
    "className",
    "startTime",
    "endTime",
    "option"
  ]
  listGenders: string[] = [
    "Male",
    "Female",
    "Uncheck"
  ]
  dataSource = new MatTableDataSource<Student>();
  detailSource = new MatTableDataSource<Mark>();
  scheduleSource = new MatTableDataSource<StudentSchedule>();
  selection = new SelectionModel<Student>(true, []);
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

  constructor(private _studentService: StudentService, private _courseService: CourseService, private _classService: ClassService,
              private _markService: MarkService, private _formBuilder: FormBuilder,
              public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required],
      birth: ['', Validators.required],
      gender: ['Male', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      title: ['', Validators.required]
    }); 
    this.registerForm = this._formBuilder.group({
      student: ['', Validators.required],
      course: ['', Validators.required],
      class: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    })
    this.getAllStudents();
  }

  getAllStudents() {
    this._studentService.getAllStudent().subscribe(success => {
      this.listStudents = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Student>(this.listStudents);
      this.openSnackBar("Success", "Students loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list students");
    });
  }

  addStudent() {
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
      title: this.createForm.controls.title.value,
    }
    this._studentService.addStudent(body).subscribe(
      success => {
        this.listStudents.push(success.body as Student);
        this.dataSource = new MatTableDataSource<Student>(this.listStudents);
        this.isCreating = false;
        this.panelOpenState = true;
        this.detailOpenState = false;
        this.openSnackBar("Success", `Add ${this.createForm.controls.name.value} successfully`);
      },
      err => {
        this.openSnackBar("Failed", `Add ${this.createForm.controls.name.value} failure`);
      }
    )
  }

  editStudent() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
      birth: this.createForm.controls.birth.value,
      gender: this.createForm.controls.gender.value,
      phone: this.createForm.controls.phone.value,
      email: this.createForm.controls.email.value,
      title: this.createForm.controls.title.value,
    }

    this._studentService.updateStudent(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update ${this.createForm.controls.name.value} successfully`);
        let itemIndex = this.listStudents.findIndex(item => item.id == body.id);
        body.birth = moment(body.birth).format("YYYY-MM-DD");
        this.listStudents[itemIndex] = body as Student;
        this.dataSource = new MatTableDataSource<Student>(this.listStudents);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
        this.detailOpenState = false;
      },
      err => {
        this.openSnackBar("Failed", `Update ${this.createForm.controls.name.value} failure`);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
        this.detailOpenState = false;
      }
    )
  }

  detailStudent(element: any) {
    this.detailOpenState = true;
    this.panelOpenState = false;
    this.selectedStudent = element;
    this._markService.getMarkByStudentId(element.id).subscribe(success => {
      this.listDetail = _.sortBy(success);
      this.detailSource = new MatTableDataSource<Mark>(this.listDetail);
    })
  }

  showCreateForm() {
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = true;
    this.isEdit = false;
    this.detailOpenState = false;

    this.createForm.controls.gender.setValue("Male");
  }

  showEditForm(element: any) {
    this.createForm.controls.id.setValue(element['id']);
    this.createForm.controls.name.setValue(element['name']);
    this.createForm.controls.birth.setValue(element['birth']);
    this.createForm.controls.gender.setValue(element['gender']);
    this.createForm.controls.phone.setValue(element['phone']);
    this.createForm.controls.email.setValue(element['email']);
    this.createForm.controls.title.setValue(element['title']);

    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
    this.detailOpenState = false;
  }

  showRegisterForm(element: any) {
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = false;
    this.isRegister = true;
    this.registerForm.reset();

    this._courseService.getAllCourse().subscribe(success => {
      this.listCourses = _.sortBy(success);
      this.registerForm.controls.student.setValue(element);
      this._classService.getAllClass().subscribe(classes => {
        this.listClasses = _.sortBy(classes);
      })
    },
    err => {
      this.openSnackBar("Failed", "Failed to get Courses list");
    })
  }

  showScheduleForm(element: any) {
    this.scheduleOpenState = true;
    this.panelOpenState = false;
    this.selectedStudent = element;
    this._studentService.getSchedule(element.id).subscribe(success => {
      this.listSchedules = success;
      this.listSchedules.map(x => {
        x.startTime = moment(x.startTime).format("YYYY-MM-DD");
        x.endTime = moment(x.endTime).format("YYYY-MM-DD");
      })
      this.scheduleSource = new MatTableDataSource<StudentSchedule>(this.listSchedules);
    })
  }

  compareFn(option1, option2){
    return option1.name === option2.name;
  }

  deleteStudent(element: any) {
    this._studentService.deleteStudent(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete ${element.name} successfully`);
        const index = this.listStudents.findIndex(student => student.id == element.id);
        if (index > -1) {
          this.listStudents.splice(index, 1);
          this.dataSource = new MatTableDataSource<Student>(this.listStudents);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Cannot delete ${element.name}`);
      }
    )
  }

  registerCourse() {
    let body = {
      id: {
        studentId: this.registerForm.controls.student.value,
        courseId: this.registerForm.controls.course.value,
        classId: this.registerForm.controls.class.value
      },
      startTime: this.registerForm.controls.startTime.value,
      endTime: this.registerForm.controls.endTime.value,
    }
    this._studentService.createSchedule(body).subscribe(success => {
      this.openSnackBar("Success", `Regis successfully`);
      this.panelOpenState = true;
      this.isRegister = false;
    },
    err => {
      this.openSnackBar("Failed", `Regis failed`);
    })
  }

  exportStudent() {
    var doc = new jsPDF('p', 'pt', [ 595.28,  841.89])
    var col = ["Id", "Name", "Birth", "Gender", "Phone", "Email", "Title"];
    var rows = [];
    this.listStudents.forEach(x => {
      var temp = [];
      for (var key in x) {
        temp.push(x[key]);
      }
      rows.push(temp);
    })
    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text("List Student", data.settings.margin.left, 50);
    };
    doc.autoTable(col, rows, {margin: {top: 80}, beforePageContent: header});
    doc.save(`students.pdf`);
  }

  exportMark(element: any) {
    var doc = new jsPDF('p', 'pt', [ 595.28,  841.89])
    var col = ["Student Name", "Course Name", "Term", "Mark"];
    var rows = [];
    this.listDetail.map(x => {
      var temp = [];
      temp.push(x.id.student.name);
      temp.push(x.id.course.name);
      temp.push(x.id.term.name);
      temp.push(x.mark);
      rows.push(temp);
    })
    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text(`${element.id.student.name}'s marks`, data.settings.margin.left, 50);
    };
    doc.autoTable(col, rows, {margin: {top: 80}, beforePageContent: header});
    doc.save(`${element.id.student.name}-marks.pdf`);
  }

  exportSchedule(element: any) {
    var doc = new jsPDF('p', 'pt', [ 595.28,  841.89])
    var col = ["Student Name", "Course Name", "Class Name", "Start Time", "End Time"];
    var rows = [];
    this.listSchedules.map(x => {
      var temp = [];
      temp.push(x.id.studentId.name);
      temp.push(x.id.courseId.name);
      temp.push(x.id.classId.name);
      temp.push(x['startTime']);
      temp.push(x['endTime']);
      rows.push(temp);
    })
    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text(`${element.id.studentId.name}'s schedule`, data.settings.margin.left, 50);
    };
    doc.autoTable(col, rows, {margin: {top: 80}, beforePageContent: header});
    doc.save(`${element.id.studentId.name}-schedule.pdf`);
  }

  cancel() {
    this.isCreating = false;
    this.isEdit = false;
    this.isRegister = false;
    this.panelOpenState = true;
    this.detailOpenState = false;
  }

  clear() {
    this.createForm.reset();
  }

  goBack() {
    this.detailOpenState = false;
    this.scheduleOpenState = false;
    this.panelOpenState = true;
  }

  openSnackBar(alert: string, message: string) {
    this.snackBar.open(alert, message, { duration: 2000 });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openConfirmDialog(element: any): void {
    const dialogRef = this.dialog.open(ConfirmStudentDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteStudent(element);
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmStudentDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmStudentDialog>) { }

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}
