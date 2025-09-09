import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,                                
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],    
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;        
  errorMessage ='';

  constructor(private fb: FormBuilder, private http: HttpClient, private router : Router) {
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onLogin() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/login', this.loginForm.value).subscribe({
        next: (res: any) => {
          if(res.success){
            this.router.navigate(['/home']);
          }else{
            this.errorMessage = res.message;
          }
        },
        error: (err) => {
          this.errorMessage= err.error.message || 'Login failed';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form';
    }
  }
}
