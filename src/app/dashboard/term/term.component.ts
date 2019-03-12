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
import { TermService } from './term.service';
import * as _ from 'underscore';
import { Student } from 'src/app/_models/student';
import { StudentService } from '../student/student.service';
import { Term } from 'src/app/_models/term';
import { CourseService } from '../course/course.service';
import { Course } from 'src/app/_models/course';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  listTerms: any[] = [];
  listCourses: Course[] = [];
  isCreating = false;
  isEdit = false;
  selectedTerm = "";
  listStudents: Student[] = [];
  selectedStudent: Student;

  // Form Group
  createForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "id",
    "name",
    "option"
  ];

  // Data Source
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<Term>(true, []);
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

  constructor(private _termService: TermService, private _formBuilder: FormBuilder, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required]
    });
    this.getAllTerms();
  }

  getAllTerms() {
    this._termService.getAllTerm().subscribe(success => {
      this.listTerms = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Term>(this.listTerms);
      this.openSnackBar("Success", "Terms loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Terms");
    });
  }

  addTerm() {
    let body = {
      name: this.createForm.controls.name.value,
    }
    this._termService.addTerm(body).subscribe(
      success => {
        success.body['quantity'] = 0;
        this.listTerms.push(success.body);
        this.dataSource = new MatTableDataSource<Term>(this.listTerms);
        this.isCreating = false;
        this.panelOpenState = true;
        this.detailOpenState = false;
        this.openSnackBar("Success", `Add successfully`);
      },
      err => {
        this.openSnackBar("Failed", `Add failure: ${err}`);
      }
    )
  }

  editTerm() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
    }
    this._termService.updateTerm(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update successfully`);
        let itemIndex = this.listTerms.findIndex(item => item.id == body.id);
        body['quantity'] = this.listTerms[itemIndex]['quantity'];
        this.listTerms[itemIndex] = body;
        this.dataSource = new MatTableDataSource<Term>(this.listTerms);
        this.panelOpenState = true;
        this.isCreating = false;
        this.isEdit = false;
      },
      err => {
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
    this.createForm.controls.id.setValue(element.id);
    this.createForm.controls.name.setValue(element.name);
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
  }

  deleteTerm(element: any) {
    this._termService.deleteTerm(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete successfully`);
        const index = this.listTerms.findIndex(term => term.id == element.id);
        if (index > -1) {
          this.listTerms.splice(index, 1);
          this.dataSource = new MatTableDataSource<Term>(this.listTerms);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Cannot delete ${element.name}. Please delete all marks before deleting`);
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
    const dialogRef = this.dialog.open(ConfirmTermDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteTerm(element);
    });
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmTermDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmTermDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}


