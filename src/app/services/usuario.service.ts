import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( 
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone // Sirve para cuando se ejecutan cosas por fuera de angular. Funciones que se ejecuten desde librerías
  ) { }


  logout(){
    localStorage.removeItem('token');
    
    google.accounts.id.revoke('correo', () => {
      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      })   
    })
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (res: any) =>{
        localStorage.setItem('token', res.token);
      }),
      map( res => true ), // Si hay una res, entonces se retorna true
      catchError( err => of(false)) // El of() retorna un observable con el valor especificado en el parámetro
    );
  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (res: any) => {
                    localStorage.setItem('token', res.token);
                  })
                );
  }

  login( formData: LoginForm ) {
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (res: any) => {
                    localStorage.setItem('token', res.token);
                  })
                );
  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`, { token }).pipe(
      tap( (res: any) => {
        localStorage.setItem('token', res.token);
      })
    )
  }
}
