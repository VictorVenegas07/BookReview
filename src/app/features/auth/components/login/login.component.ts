import { Component } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLinkWithHref, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    try {
      const response = await this.authService.login(this.email, this.password);
      console.log('Inicio de sesión exitoso', response);
  
      if (response) {
        this.router.navigate(['home/book']);
      }
  
      const profileResponse = await this.authService.Getprofile().toPromise();
      console.log('User profile:', profileResponse);
  
    } catch (error) {
      console.error('Error al iniciar sesión o al obtener el perfil:', error);
    }
  }
  

}
