import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted: boolean = false;

  public registerForm: FormGroup = this.fb.group({
    nombre: ['Steven', [Validators.required, Validators.minLength(3)]],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(4)]],
    password2: ['123456', [Validators.required, Validators.minLength(4)]],
    terminos: [true, Validators.required],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( 
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  crearUsuario(){
    this.formSubmitted = true;
    if( this.registerForm.invalid ){
      return;
    }

    // Sí es válida realizo el posteo
    this.usuarioService.crearUsuario( this.registerForm.value ).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    })
  }

  campoNoValido( campo: string): boolean{
    return this.formSubmitted && this.registerForm.get(campo)!.invalid;
  }

  aceptaTerminos(): boolean{
    return this.formSubmitted && !this.registerForm.get('terminos')!.value
  }

  invalidPasswords(): boolean {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;

    return (pass1 !== pass2) && this.formSubmitted;
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if( pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true})
      }
    }
  }
}
