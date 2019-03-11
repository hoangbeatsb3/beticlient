import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  navigationItem = [
    { 'link': 'student', 'name': 'Students', 'icon': 'group'},
    { 'link': 'teacher', 'name': 'Teachers', 'icon': 'assignment_ind'},
    { 'link': 'subject', 'name': 'Subjects', 'icon': 'school'},
    { 'link': 'mark', 'name': 'Marks', 'icon': 'bar_chart'},
    { 'link': 'schedule', 'name': 'Schedule', 'icon': 'calendar_today'},
    { 'link': 'course', 'name': 'Course', 'icon': 'import_contacts'}
  ]

  activeLabel: string = "";
  currentUser: any;
  
  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
              private authenticationService: AuthenticationService) {}

  public activeLink(index) { 
    let url = this.router.url;
    if (this.activeLabel != index.name) {
      this.activeLabel = index.name;
      if (url.includes(index.link)) {
        window.location.reload()
      }  else {
        this.router.navigateByUrl(index.link);
      } 
    } else if (this.activeLabel == index.name) {
      window.location.reload();
    }
  }

  logout() {
    this.authenticationService.logout();
    window.location.reload()
  }

}
