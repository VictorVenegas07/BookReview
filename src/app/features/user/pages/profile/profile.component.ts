import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {
    id: 0,
    username: '',
    fullName: '',
    email: ''
  };
  profilePictureUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadProfilePicture();
  }

  loadUserProfile(): void {
    this.userService.Getprofile().subscribe((response: any) => {
      if (response.success) {
        this.user = response.data;
      }
    });
  }

  editProfile(): void {
    console.log('Editar perfil');
  }

  loadProfilePicture(): void {
    this.userService.getProfilePicture().subscribe(
      (response: Blob) => {
        
        if (response.size !== 0) {
          this.profilePictureUrl = URL.createObjectURL(response); // Liberar el objeto URL anterior
        }
      },
      (error) => {
        console.error('Error al cargar la imagen de perfil', error);
      }
    );
  }

  volver() {
    window.history.back();
  }
  
  seleccionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;

        this.profilePictureUrl = base64String;

        this.enviarImagenAlServidor(base64String);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };

      reader.readAsDataURL(file); 
    }
  }

  enviarImagenAlServidor(base64String: string) {
    const payload = {
      username: this.user.username,
      imagenBase64: base64String
    };

    this.userService.updateProfilePicture(base64String) .subscribe({
      next: (response) => {
        console.log('Imagen subida con éxito:', response);
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
      }
    });
  }
}
