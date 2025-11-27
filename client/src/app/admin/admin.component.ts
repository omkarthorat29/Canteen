import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  selectedDate = new Date().toISOString().split('T')[0];
  records:any;
  constructor(private loginService: LoginService) {}
  ngOnInit(): void {
    this.updateDate()
  }
  updateDate() {
    this.loginService.getReport(this.selectedDate || new Date().toLocaleDateString())
    .subscribe(data => {
      this.records = data;
    })
  }
  logout() {
    this.loginService.userActive = false
  }
}
