import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { UsuarioService } from '../../services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;
 
  public formSubmitted: boolean = false;

  public loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [false]
  });



  constructor( 
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone // Sirve para cuando se ejecutan cosas por fuera de angular. Funciones que se ejecuten desde librerías
  ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: '261295771603-da46b08oeeen67pa2icf15abih1qr5a5.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response) // Se pasa como parámetro para que no cambie la referencia al this. Si solo pasamos la función, el this cambiaría
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement, // Referenciamos el botón
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ){
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential ).subscribe({
      next: (res) => {
        //console.log({login: res});
        this.ngZone.run(() =>{ // Se usa el ngZone porque es la librería de google la que ejecuta esta redirección
          this.router.navigateByUrl('/');
        })
      }
    })
  }

  login() {

    this.usuarioService.login( this.loginForm.value).subscribe({
      next: (res) => {
        if( this.loginForm.get('remember')!.value ){
          localStorage.setItem('email', this.loginForm.get('email')!.value);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      },
      error: (err) => Swal.fire('Error', err.error.msg, 'error'),
    })

  }

}
