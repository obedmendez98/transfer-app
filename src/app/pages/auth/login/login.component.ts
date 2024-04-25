import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isUsernameValid: boolean = false;
  isPasswordValid: boolean = false;
  isFormValid: boolean = true;
  messageError: string = 'Complete Form';

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  onBlur(field: string): void {
    setTimeout(() => {
      if (field === 'username') {
        this.isUsernameValid = this.validateUsername();
      } else if (field === 'password') {
        this.isPasswordValid = this.validatePassword();
      }
    }, 1000);
  }

  validateUsername(): boolean {
    const username = this.loginForm.get('username')?.value;
    const usernameRegex = /^[a-zA-Z0-9!\"$%&/]{8,20}$/;
    return usernameRegex.test(username);
  }

  validatePassword(): boolean {
    const password = this.loginForm.get('password')?.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"$%&/])[a-zA-Z0-9!\"$%&/]{8,20}$/;
    return passwordRegex.test(password);
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isFormValid = true;
      console.log(this.loginForm.value)
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          this.router.navigate(['/home']);
        },
        (error: HttpErrorResponse) => {
          this.isFormValid = false;
          if (error.status === 401) {
            console.error('Unauthorized:', error.error.message);
            this.messageError = error.error.message ?? 'Unauthorized';
          } else if (error.status === 404) {
            console.error('Not Found:', error.error.message);
          } else {
            console.error('HTTP Error:', error.message);
          }
        }
      );
    }else{
      this.isFormValid = false;
    }
  }

}
