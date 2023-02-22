import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, pipe, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public showButtons: boolean = true;
  public imgSubs!: Subscription;

  constructor( 
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnInit(): void {
    this.getUsuarios();
    this.imgSubs = this.modalImagenService.newImage
      .pipe(
        delay(900) // agrega una demora extra para que no se ejecute de inmediato el observable
      )
      .subscribe( img => this.getUsuarios() ); // Cada que se emite un valor, se dispara el getUsuarios
  }

  ngOnDestroy(): void {
    // desuscribrirse cuando el componente sea desmontado. Esto para que el observable no siga escuchando los cambios cuando cambiemos de módulo
    // previene fugas de memoria
    this.imgSubs.unsubscribe(); 
  }

  getUsuarios(){
    this.cargando = true;
    this.usuarioService.getUsuarios(this.desde).subscribe({
      next: ({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      }
    })
  }

  cambiarPagina( valor: number ){
    this.desde += valor;
    if(this.desde < 0){
      this.desde = 0
    } else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.getUsuarios();
  }

  buscar( termino: string ){
    if(termino.length === 0){
      this.showButtons = true;
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino).subscribe( (res) => {
      this.usuarios = res as Usuario[];
      this.showButtons = false;
    });
    return;
  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No puede borrarse así mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe({
          next: () => {
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
            this.getUsuarios();
          }
        });
      }
    })

    return;
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario).subscribe({
      next: (res) => console.log(res),
    })
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

}
