import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule, RouterLinkWithHref],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isSidebarOpen = false;
  profilePictureUrl: string = "" ;
  user: any = {
    id: 0,
    username: '',
    fullName: '',
    email: ''
  };
  constructor(private authService: AuthService, private router: Router) {
    console.log('HomeComponent initialized');
    
  }
  ngOnInit(): void {
    this.user = this.authService.getuserStorage();
    this.loadProfilePicture()
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  cerrarSesion() {

    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  async loadProfilePicture(): Promise<void> {
    try {
      const response = await this.authService.getProfilePicture();
      
      if (response.size !== 0) {
        this.profilePictureUrl = URL.createObjectURL(response); // Crea URL temporal
      }
    } catch (error) {
      console.error('Error al cargar la imagen de perfil', error);
    }
  }
  
}
