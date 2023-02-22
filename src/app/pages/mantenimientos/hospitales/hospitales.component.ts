import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;
  public termino!: string;

  constructor( 
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.getHospitales();

    this.imgSubs = this.modalImagenService.newImage
    .pipe(
      delay(900)
    )
    .subscribe( img => this.getHospitales() ); 
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  getHospitales(){
    this.cargando = true;
    this.hospitalService.getHospitales().subscribe({
      next: (hospitales) => {
        this.cargando = false;
        this.hospitales = hospitales;
      }
    })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital( hospital.nombre, hospital._id! ).subscribe({
      next: () => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      }
    })
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital( hospital._id! ).subscribe({
      next: () => {
        this.getHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      }
    })
  }

  async abrirSweetAlert(){
    const { value } = await Swal.fire<string>({
      title: 'Crear hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })
    
    if( value && value?.trim().length > 0 ){
      this.hospitalService.crearHospital( value ).subscribe({
        next: (res: any) => {
          this.hospitales.push( res.hospital )
        }
      })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

  buscarHospitales(){
    if(!this.termino || this.termino.length === 0) return this.getHospitales();
    this.busquedasService.buscar('hospitales', this.termino).subscribe({
      next: (res: any) => {
        this.hospitales = res;
      }
    })
  }
}