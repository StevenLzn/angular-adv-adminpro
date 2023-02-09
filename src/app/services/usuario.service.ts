import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { map, tap, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { GetUsuario } from '../interfaces/get-usuarios.interface';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Los objetos en javascript pasan por referencia
  // Entonces al editar el objeto en algún módulo, lo cambiaría directamente en el origen
  // Y todos los módulos que estén usando este objeto, también van a ser actualizados
  public usuario!: Usuario;

  constructor( 
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone // Sirve para cuando se ejecutan cosas por fuera de angular. Funciones que se ejecuten desde librerías
  ) { }

  get token(){
    return localStorage.getItem('token') || '';
  }

  get uid(){
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout(){
    localStorage.removeItem('token');
    
    if( this.usuario.google ){
      google.accounts.id.revoke('correo', () => {
        this.ngZone.run(() =>{
          this.router.navigateByUrl('/login');
        })   
      })
    } else{
      this.router.navigateByUrl('/login');
    }

  }

  validarToken(): Observable<boolean>{

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (res: any) => {
        //this.usuario = res.usuario; // La asignación no instancia el objeto. Si la clase tiene métodos, no se podrían llamar ya que usuario no ha sido instanciado

        const {email, google, nombre, role, img = '', uid } = res.usuario;
        // Si se quiere tener acceso a los métodos de la clase, entonces se instancia el objeto
        this.usuario = new Usuario(nombre, email, '', google, img, role, uid ); // Esta es una nueva instancia de la clase usuario
        localStorage.setItem('token', res.token);
        return true;
      }),
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

  actualizarPerfil( data: {email: string, nombre: string, role: string} ){

    data = {
      ...data,
      role: this.usuario.role!
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
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

  getUsuarios( desde: number = 0 ){

    const url = `${base_url}/usuarios?desde=${desde}`;
    // Se tipa la respuesta, para que al suscribirse se pueda tener el tipado
    return this.http.get<GetUsuario>(url, this.headers)
            .pipe(
              map( res => {
                // Se mapea la respuesta
                // Por cada usuario se crea una instancia de la clase Usuario
                // Como es una instancia, podemos usar los métodos que nos da la clase
                // En este caso podríamos acceder al método para obtener el avatar
                const usuarios = res.usuarios.map( user => 
                  new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid) 
                )
                // Retornamos los datos mapeados
                return {
                  total: res.total,
                  usuarios
                };
              })
            )
  }

  eliminarUsuario(usuario: Usuario){
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers)
  }

  guardarUsuario( usuario: Usuario ){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
