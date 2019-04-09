import { Component, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatDialog,
  MatDialogRef,
  MatSnackBar,
} from "@angular/material";
import { Course } from 'src/app/_models/course';
import { CourseService } from './course.service';
import * as _ from 'underscore';
import { Mark } from 'src/app/_models/mark';
declare let jsPDF;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  listCourses: Course[] = [];
  listDetail: Mark[] = [];
  isCreating = false;
  isEdit = false;
  selectedCourse = "";

  // Form Group
  createForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "id",
    "name",
    "startTime",
    "endTime",
    "option"
  ];

  // Data Source
  dataSource = new MatTableDataSource<Course>();
  detailSource = new MatTableDataSource<Mark>();
  selection = new SelectionModel<Course>(true, []);
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

  constructor(private _courseService: CourseService, private _formBuilder: FormBuilder,
              public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }); 
    this.getAllCourses();
  }

  getAllCourses() {
    this._courseService.getAllCourse().subscribe(success => {
      this.listCourses = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Course>(this.listCourses);
      this.openSnackBar("Success", "Courses loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Courses");
    });
  }

  addCourse() {
    let body = {
      name: this.createForm.controls.name.value,
      startTime: this.createForm.controls.startTime.value,
      endTime: this.createForm.controls.endTime.value,
    }
    this._courseService.addCourse(body).subscribe(
      success => {
        this.listCourses.push(success.body as Course);
        this.dataSource = new MatTableDataSource<Course>(this.listCourses);
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

  editCourse() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
      startTime: this.createForm.controls.startTime.value,
      endTime: this.createForm.controls.endTime.value,
    }

    this._courseService.updateCourse(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update ${this.createForm.controls.name.value} successfully`);
        let itemIndex = this.listCourses.findIndex(item => item.id == body.id);
        this.listCourses[itemIndex] = body as Course;
        this.dataSource = new MatTableDataSource<Course>(this.listCourses);
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

  showCreateForm() {
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = true;
    this.isEdit = false;
    this.detailOpenState = false;
  }

  showEditForm(element: any) {
    this.createForm.controls.id.setValue(element['id']);
    this.createForm.controls.name.setValue(element['name']);
    this.createForm.controls.startTime.setValue(element['startTime']);
    this.createForm.controls.endTime.setValue(element['endTime']);
    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
  }

  deleteCourse(element: any) {
    this._courseService.deleteCourse(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete ${element.name} successfully`);
        const index = this.listCourses.findIndex(Course => Course.id == element.id);
        if (index > -1) {
          this.listCourses.splice(index, 1);
          this.dataSource = new MatTableDataSource<Course>(this.listCourses);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Please delete all related data in ${element.name} first`);
      }
    )
  }

  exportCourse() {
    var doc = new jsPDF('p', 'pt', [ 595.28,  841.89])
    var col = ["Id", "Name", "Start Time", "End Time"];
    var rows = [];
    this.listCourses.forEach(x => {
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
      doc.text("List Course", data.settings.margin.left, 50);
    };
    doc.autoTable(col, rows, {margin: {top: 80}, beforePageContent: header});
    doc.save(`courses.pdf`);
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
    const dialogRef = this.dialog.open(ConfirmCourseDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteCourse(element);
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmCourseDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmCourseDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}
