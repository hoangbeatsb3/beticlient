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
  MatSlideToggleModule,
} from "@angular/material";
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { UserService } from './user.service';
import * as _ from 'underscore';
import { Mark } from 'src/app/_models/mark';
import { Course } from '../../_models/course';
import { Class } from '../../_models/class';
import { CourseService } from '../course/course.service';
import { MarkService } from '../mark/mark.service';
import { ClassService } from '../class/class.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // Common properties
  panelOpenState = true;
  detailOpenState = false;
  scheduleOpenState = false;
  listUsers: User[] = [];
  listCourses: Course[] = [];
  listClasses: Class[] = [];
  listDetail: Mark[] = [];
  isCreating = false;
  isEdit = false;
  isRegister = false;
  resetChecked = false;
  selectedUser: User;

  // Form Group
  createForm: FormGroup;
  registerForm: FormGroup;

  // Paginator
  displayedColumns: string[] = [
    "id",
    "name",
    "username",
    "email",
    "role",
    "option"
  ];
  listRoles: string[] = [
    "pm",
    "admin"
  ]
  dataSource = new MatTableDataSource<User>();
  detailSource = new MatTableDataSource<Mark>();
  selection = new SelectionModel<User>(true, []);
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

  constructor(private _userService: UserService, private _courseService: CourseService, private _classService: ClassService,
              private _markService: MarkService, private _formBuilder: FormBuilder, private router: Router,
              public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm = this._formBuilder.group({
      id: ['', Validators.nullValidator],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.nullValidator],
      email: ['', Validators.required],
      role: ['pm', Validators.required]
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this._userService.getAllUser().subscribe(success => {
      this.listUsers = _.sortBy(success);
      this.dataSource = new MatTableDataSource<User>(this.listUsers);
      this.openSnackBar("Success", "Users loaded");
    },
    error => {
      this.openSnackBar("Failed", "Cannot get list Users");
    });
  }

  addUser() {
    if (!this.createForm.controls.email.value.includes("@")) {
      this.openSnackBar("Warming", "Email format: example@example.com");
      return;
    }
    if (this.createForm.controls.password.value == '') {
      this.openSnackBar("Warming", "Password can't be empty");
      return;
    }
    let body = {
      name: this.createForm.controls.name.value,
      username: this.createForm.controls.username.value,
      email: this.createForm.controls.email.value,
      role: [this.createForm.controls.role.value],
      password: this.createForm.controls.password.value
    }
    this._userService.addUser(body).subscribe(
      success => {
        this.getAllUsers();
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

  editUser() {
    let body = {
      id: this.createForm.controls.id.value,
      name: this.createForm.controls.name.value,
      username: this.createForm.controls.username.value,
      email: this.createForm.controls.email.value,
      password: '',
      roles: this.createForm.controls.role.value == 'admin' ? [{"id": 3,"name": "ROLE_ADMIN"}] 
                                                            : [{"id": 2,"name": "ROLE_PM"}]
    }
    if (this.resetChecked) body['password'] = this.createForm.controls.password.value;
    this._userService.updateUser(body).subscribe(
      success => {
        this.openSnackBar("Success", `Update ${this.createForm.controls.name.value} successfully`);
        let itemIndex = this.listUsers.findIndex(item => item.id == body.id);
        this.listUsers[itemIndex] = {
          id: this.createForm.controls.id.value,
          name: this.createForm.controls.name.value,
          username: this.createForm.controls.username.value,
          email: this.createForm.controls.email.value,
          roles: this.createForm.controls.role.value == 'admin' ? "ROLE_ADMIN"
                                                                : "ROLE_PM"
        }
        this.dataSource = new MatTableDataSource<User>(this.listUsers);
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


  showCreateForm() {
    let index = JSON.parse(localStorage.currentUser).authorities.findIndex(x => x.authority == 'ROLE_ADMIN');
    if (index == -1) {
      this.openSnackBar("Failed", "Security Issue");
      return;
    }
    this.createForm.reset();
    this.panelOpenState = false;
    this.isCreating = true;
    this.isEdit = false;
    this.detailOpenState = false;

    this.createForm.controls.role.setValue("pm");
  }

  showEditForm(element: any) {
    let index = JSON.parse(localStorage.currentUser).authorities.findIndex(x => x.authority == 'ROLE_ADMIN');
    if (index == -1) {
      this.openSnackBar("Failed", "Security Issue");
      return;
    }
    this.createForm.controls.id.setValue(element['id']);
    this.createForm.controls.name.setValue(element['name']);
    this.createForm.controls.username.setValue(element['username']);
    this.createForm.controls.password.setValue('');
    this.createForm.controls.email.setValue(element['email']);
    let role = element['role'] == 'ROLE_PM' ? 'pm' : 'admin';
    this.listRoles.filter(x => x == role).map(x => this.createForm.controls.role.setValue(x))

    this.panelOpenState = false;
    this.isCreating = false;
    this.isEdit = true;
    this.detailOpenState = false;
  }

  compareFn(option1, option2){
    return option1.name === option2.name;
  }

  deleteUser(element: any) {
    this._userService.deleteUser(element.id).subscribe(
      success => {
        this.openSnackBar("Success", `Delete ${element.name} successfully`);
        const index = this.listUsers.findIndex(user => user.id == element.id);
        if (index > -1) {
          this.listUsers.splice(index, 1);
          this.dataSource = new MatTableDataSource<User>(this.listUsers);
        }
      }, 
      err => {
        this.openSnackBar("Failed", `Cannot delete ${element.name}`);
      }
    )
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
    const dialogRef = this.dialog.open(ConfirmUserDialog, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm == true) this.deleteUser(element);
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dialog.html',
})
export class ConfirmUserDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmUserDialog>) { }

  onNoClick(): void {
    this.dialogRef.close({ 'confirm': false });
  }

  confirmOnChange() {
    this.dialogRef.close({ 'confirm': true });
  }
}
