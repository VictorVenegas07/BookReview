import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    fullName: '',
    email: '',
    passwordHash: '',
  };
  registerForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userToRegister = {
      ...this.registerForm.value,
      photo: null
    };
    this.authService.register(userToRegister).subscribe(
      response => {
        this.toastr.success(`Registro exitoso`, 'Bienvenido', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
        this.router.navigate(['auth/login']);
      },
      error => {
        console.error('Error al registrar', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['auth/login']); // Redirige a la página de inicio de sesión
  }
}
