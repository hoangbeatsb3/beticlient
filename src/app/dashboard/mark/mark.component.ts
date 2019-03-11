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
import { Mark } from 'src/app/_models/mark';
import { MarkService } from './mark.service';
import * as _ from 'underscore';
import { Student } from 'src/app/_models/student';
import { Subject } from 'src/app/_models/subject';
import { StudentService } from '../student/student.service';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: ['./mark.component.css']
})
export class MarkComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  listMarks: Mark[] = [];
  listDetail: Mark[] = [];
  isCreating = false;
  isEdit = false;
  selectedMark = "";
  listStudents: Student[] = [];
  listSubjects: Subject[] = [];
  selectedStudent: Student;
  selectedSubject: Subject;

  // Form Group
  createForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "studentName",
    "subjectName",
    "courseName",
    "phone",
    "email",
    "title",
    "mark",
    "option"
  ];

  // Data Source
  dataSource = new MatTableDataSource<Mark>();
  detailSource = new MatTableDataSource<Mark>();
  selection = new SelectionModel<Mark>(true, []);
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

  constructor(private _markService: MarkService, private _studentService: StudentService, 
              private _formBuilder: FormBuilder, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      mark: ['', Validators.required],
      student: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.getAllMarks();
  }

  getAllMarks() {
    this._markService.getAllMark().subscribe(success => {
      this.listMarks = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Mark>(this.listMarks);
      this._studentService.getAllStudent().subscribe(success => {
        this.listStudents = success;
      });
      this.openSnackBar("Success", "Marks loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Marks");
    });
  }

  addMark() {
    let body = {
      id: {
        student_id: this.createForm.controls.student.value.id,
        subject_id: this.createForm.controls.subject.value.id,
      },
      mark: this.createForm.controls.mark.value,
      student: this.createForm.controls.student.value,
      subject: this.createForm.controls.subject.value,
    }
    this._markService.addMark(body).subscribe(
      success => {
        this.listMarks.push(success.body as Mark);
        this.dataSource = new MatTableDataSource<Mark>(this.listMarks);
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

  editMark() {
    let body = {
      id: this.createForm.controls.id.value,
      mark: this.createForm.controls.mark.value,
      student: this.createForm.controls.student.value,
      subject: this.createForm.controls.subject.value,
    }
    this._markService.updateMark(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update successfully`);
        let itemIndex = this.listMarks.findIndex(item => item.id == body.id);
        this.listMarks[itemIndex] = body as Mark;
        this.dataSource = new MatTableDataSource<Mark>(this.listMarks);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
      },
      err => {
        this.openSnackBar("Failed", `Update failure`);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
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
    this.createForm.controls.id.setValue(element.id);
    this.createForm.controls.mark.setValue(element.mark);
    this.createForm.controls.student.setValue(element.student);
    this.createForm.controls.subject.setValue(element.subject);
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
  }

  deleteMark(element: any) {
    this._markService.deleteMark(element.student.id, element.subject.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete successfully`);
        const index = this.listMarks.findIndex(mark => mark.student.id == element.student.id && mark.subject.id == element.subject.id);
        if (index > -1) {
          this.listMarks.splice(index, 1);
          this.dataSource = new MatTableDataSource<Mark>(this.listMarks);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Please delete all subject in first`);
      }
    )
  }

  compareFn(student1, student2){
    return student1.name === student2.name && student1.email === student2.email;
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
    const dialogRef = this.dialog.open(ConfirmMarkDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteMark(element);
    });
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmMarkDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmMarkDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}

