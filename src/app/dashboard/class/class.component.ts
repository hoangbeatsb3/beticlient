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
import { Class } from 'src/app/_models/class';
import { ClassService } from './class.service';
import * as _ from 'underscore';
import { Student } from 'src/app/_models/student';
import { Term } from 'src/app/_models/term';
import { Course } from 'src/app/_models/course';
declare let jsPDF;

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  listClasses: any[] = [];
  listTerms: Term[] = [];
  listCourses: Course[] = [];
  isCreating = false;
  isEdit = false;
  selectedClass = "";
  listStudents: Student[] = [];
  selectedStudent: Student;

  // Form Group
  createForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "id",
    "name",
    "quantity",
    "option"
  ];

  // Data Source
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<Class>(true, []);
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

  constructor(private _classService: ClassService,
              private _formBuilder: FormBuilder, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required]
    });
    this.getAllClasses();
  }

  getAllClasses() {
    this._classService.getAllClass().subscribe(success => {
      success.map(element => {
        this._classService.getCountById(element.id).subscribe(success => {
          element['quantity'] = success;
        })
      })
      this.listClasses = _.sortBy(success);
      this.dataSource = new MatTableDataSource<Class>(this.listClasses);
      this.openSnackBar("Success", "Classs loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Classs");
    });
  }

  addClass() {
    let body = {
      name: this.createForm.controls.name.value,
    }
    this._classService.addClass(body).subscribe(
      success => {
        success.body['quantity'] = 0;
        this.listClasses.push(success.body);
        this.dataSource = new MatTableDataSource<Class>(this.listClasses);
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

  editClass() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
    }
    this._classService.updateClass(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update successfully`);
        let itemIndex = this.listClasses.findIndex(item => item.id == body.id);
        body['quantity'] = this.listClasses[itemIndex]['quantity'];
        this.listClasses[itemIndex] = body;
        this.dataSource = new MatTableDataSource<Class>(this.listClasses);
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

  deleteClass(element: any) {
    this._classService.deleteClass(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete successfully`);
        const index = this.listClasses.findIndex(x => x.id == element.id);
        if (index > -1) {
          this.listClasses.splice(index, 1);
          this.dataSource = new MatTableDataSource<Class>(this.listClasses);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Cannot delete ${element.name}. Please delete all schedules before deleting`);
      }
    )
  }

  exportClass() {
    var doc = new jsPDF('p', 'pt', [ 595.28,  841.89])
    var col = ["Id", "Name", "Quantity"];
    var rows = [];
    this.listClasses.forEach(x => {
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
      doc.text("List Class", data.settings.margin.left, 50);
    };
    doc.autoTable(col, rows, {margin: {top: 80}, beforePageContent: header});
    doc.save(`classes.pdf`);
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
    const dialogRef = this.dialog.open(ConfirmClassDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteClass(element);
    });
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmClassDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmClassDialog>) {}

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}

