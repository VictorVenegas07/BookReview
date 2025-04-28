import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
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

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userToRegister = {
      username: this.user.username,
      passwordHash: this.user.passwordHash,
      fullName: this.user.fullName,
      email: this.user.email,
      photo: null 
    };

    this.authService.register(userToRegister).subscribe(
      response => {
        console.log('Registro exitoso', response);
        this.router.navigate(['auth/login']); // Redirige al login después del registro
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
