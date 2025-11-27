import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../login.service';
import { HttpClient } from '@angular/common/http';  // ✅ required for HttpClient

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    CommonModule,           // Required for Angular directives like *ngIf, *ngFor
    ReactiveFormsModule,
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class EntryComponent {
  entryForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.entryForm = this.fb.group({
      date: [''],
      breakfast: [false],
      lunch: [false],
    });
  }

  submitEntry(type:string) {
    const id = Math.random().toString(36).substring(2, 10);
    console.log('Form Submitted:', this.entryForm.value);
    let obj = {
      unid: id,
      ...this.entryForm.value
    }
    this.loginService.SetEntry(obj)
    .subscribe(data => {
      this.entryForm.reset()
      console.log(data)
    })
  }
}