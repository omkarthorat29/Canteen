import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], //
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  spin = false;
  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginKey: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.spin = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value.loginKey)
      .subscribe((res:any) => {
        if (res) {
          localStorage.setItem('userData', JSON.stringify(res))
          this.loginService.userActive = true;
          this.loginService.userType = res.type
        }
        this.spin = false;
      });
    }
  }
}
