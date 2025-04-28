import { Component } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [RouterLinkWithHref, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  async onLogin() {
    try {
      const response = await this.authService.login(this.email, this.password);
      console.log('Inicio de sesión exitoso', response);
  
      if (response) {
        const profileResponse = await this.authService.Getprofile().toPromise();
        
        this.toastr.success(`Bienvenido ${profileResponse.data.username}`, 'Inicio de sesión exitoso', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right'
        });
  
        this.router.navigate(['home/book']);
      }
  
    } catch (error) {
      console.error('Error al iniciar sesión o al obtener el perfil:', error);
    }
  }
  
  

}
