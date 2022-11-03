import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    } );

    /*const promesa = new Promise(( resolve, reject ) => {
      if( false ){
        resolve('Hola mundo');
      } else {
        reject('Algo salió mal');
      }
      
    });

    // Este es el proceso asíncrono
    promesa.then( ( mensaje ) => {
      console.log(mensaje);
    }).catch( error => console.log('Error en mi promesa', error));

    console.log('Fin del OnInit');*/
  }

  getUsuarios(){
    return new Promise( resolve => {
      // El fetch retorna una promesa, que resuelve algo de tipo Response
      fetch('https://reqres.in/api/users')
        .then( response => response.json()) // Se extrae el body en formato json, el json() retorna otra promesa
        .then( body => resolve( body.data ) ) // Atrapamos lo que resuelva la promesa del json()
    });
  }
}
