import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html'
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital;
  public medicoSeleccionado!: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Suscribirse a los cambios en los parámetros de la url
    // Cada que se cambia el parámetro, se obtiene siempre el último valor
    this.activatedRoute.params.subscribe({
      next: ({ id }) => { // Como parámetro llegan los parámetros. Se llama igual que como se puso en el routing. ej: /:id
        this.cargarMedico(id);
      }
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })
    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe({
      next: (hospitalId) => {
        this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId)!;
      }
    })
  }

  cargarMedico(id: string){

    if(id === 'nuevo') return;

    this.medicoService.getMedicoById(id)
      .pipe(
        delay(100)
      )
      .subscribe({
        next: (medico: any) => {
          if(!medico) {
            this.router.navigateByUrl(`/dashboard/medicos`);
            return;
          }
          // se desestructura la propiedad del objeto anidado hospital
          const {nombre, hospital: { _id }} = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({nombre, hospital: _id});
        }
      })
  }

  cargarHospitales(){
    this.hospitalService.getHospitales().subscribe({
      next: (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      }
    })
  }

  guardarMedico(){

    const { nombre } = this.medicoForm.value;

    if(this.medicoSeleccionado) {

      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico( data ).subscribe({
        next: () => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        }
      })
    } else {
      
      this.medicoService.crearMedico(this.medicoForm.value).subscribe({
        next: (res: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`);
        }
      })  
    }
  }
}
