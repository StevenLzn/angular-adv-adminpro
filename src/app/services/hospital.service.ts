import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs';
import { Hospital } from '../models/hospital.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(){
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  getHospitales(){

    const url = `${base_url}/hospitales`;
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, this.headers)
              .pipe(
                map( (res: { ok: boolean, hospitales: Hospital[] }) => res.hospitales)
              )
  }

  crearHospital( nombre: string ){
    const url = `${base_url}/hospitales`;
    return this.http.post(url, {nombre}, this.headers);
  }

  actualizarHospital( nombre: string, _id: string ){
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.headers);
  }

  borrarHospital( _id: string ){
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
