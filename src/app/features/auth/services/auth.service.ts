import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =   `${environment.API_URL}/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
  const userJson = localStorage.getItem('currentUser');
  const parsedUser = userJson ? JSON.parse(userJson) : null;
  this.currentUserSubject = new BehaviorSubject<any>(parsedUser);
  this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  

  public get userid(): any {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        console.error('Error al registrar', error);
        return of(null);  
      })
    );
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.http.post<any>(`${this.apiUrl}/login`, { email, password }).toPromise();
      if (response && response.data && response.data.accessToken) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.accessToken));
        this.currentUserSubject.next(response.data.accessToken);
      }
      return response;
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      return null;
    }
  }
  
  Getprofile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify(response.data));
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión', error);
        return of(null); 
      })
    );
  }


  logout(): void {
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getuserStorage (): any {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser;
      } catch (error) {
        console.error('Error al analizar el usuario almacenado', error);
        return null;
      }
    }
    return null;
  }

  

  hasToken(): boolean {
    const token = localStorage.getItem('currentUser');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      return false;
    }
  
    try {
      const parsedToken = JSON.parse(token);
      if (parsedToken) {
        this.currentUserSubject.next(parsedToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token inválido', error);
      return false;
    }
  }
  
  async getProfilePicture(): Promise<Blob> {
    const response = this.http.get(`${this.apiUrl}/picture`, { responseType: 'blob' }).toPromise();
    return response as Promise<Blob>;
  }
  
  updateProfilePicture(base64String: string): Observable<Blob> {
    const cleanedBase64 = base64String.split(',')[1];
    const payload = {
      picture: cleanedBase64
    };
  
    return this.http.put<Blob>( `${this.apiUrl}/picture`, payload, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      }
    })
  }
}
