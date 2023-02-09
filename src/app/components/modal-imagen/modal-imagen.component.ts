import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';


@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html'
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp!: any;

  // Se pone public el modalImagenService para poder usarlo en el html
  // De esta manera se pasa el valor por referencia. Si la propiedad cambia en el servicio, también cambia en el html
  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImagen( file: File ){
    this.imagenSubir = file;
    
    if(!file) {
      return this.imgTemp = null;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    return;
  }

  subirImagen(){

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarImg(this.imagenSubir, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'El avatar fue guardado', 'success');
        this.modalImagenService.newImage.emit(img);
        this.modalImagenService.cerrarModal();
      }).catch(err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      }); 
  }

}
