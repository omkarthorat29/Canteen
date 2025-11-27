import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { LoginService } from './login.service';
import { CommonModule, NgIf } from '@angular/common';
import { EntryComponent } from './admin/entry/entry.component';

@Component({
  selector: 'app-root',
  imports: [LoginComponent,EmployeeComponent,AdminComponent, CommonModule, EntryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  currentComponent: string = ''; // default view
  constructor(public loginService: LoginService) {}
  userActive: boolean | undefined;
  userType = '';
  ngOnInit(): void {
    if (localStorage.getItem('userData') ) {
      this.loginService.userActive = true;
      let data:any = localStorage.getItem('userData');
      if (data) {
        data = JSON.parse(data);
        this.loginService.userType = data.type
        if(this.loginService.userType === 'admin') {
          this.currentComponent = 'admin'
        }
      }
    }
  }
  title = 'canteen';
}
