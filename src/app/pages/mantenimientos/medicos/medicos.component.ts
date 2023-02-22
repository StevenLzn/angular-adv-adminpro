import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription, delay } from 'rxjs';

import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html'
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    
    this.imgSubs = this.modalImagenService.newImage
    .pipe(
      delay(900)
    )
    .subscribe( img => this.cargarMedicos() ); 
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
        this.cargando = false;
      }
    })
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.cargarMedicos();
    }
    this.busquedasService.buscar('medicos', termino).subscribe( (res) => {
      this.medicos = res as Medico[];
    });
    return;
  }

  borrarMedico( medico: Medico ){
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!).subscribe({
          next: () => {
            Swal.fire(
              'Médico borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarMedicos();
          }
        });
      }
    })
  }

}
