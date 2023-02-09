import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient) { }

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

  // Con la respuesta de la consulta, se genera un array con instancias de la clase Usuario(para tener disponible los métodos de la clase)
  private transformarUsuarios( resultados: any[] ): Usuario[]{
    return resultados.map( user => 
      new Usuario(user.nombre, user.email, '', user.google, user.img, user.uid) 
    );
  }

  buscar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string = '' ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    // Se tipa la respuesta, para que al suscribirse se pueda tener el tipado
    return this.http.get<any[]>(url, this.headers)
            .pipe(
              map( (res: any) => {
                switch(tipo){
                  case 'usuarios':
                    return this.transformarUsuarios(res.resultados);
                    break;
                  default:
                    return [];
                }
              } ) // Se extraen los resultados de la response
            )
  }
}
