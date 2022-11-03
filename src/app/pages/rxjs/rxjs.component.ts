import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs!: Subscription;

  constructor() { 
    // Para que un observable se ejecute es necesario el subscribe
    // Si no hay ningún subscribe al observable, entonces no se ejecuta nunca.
    // El pipe es como una conexión adicional, que puede transformar la información que fluye a través del observable.
    // No solo transforma información, sino que también tiene otras funcionalidades, como reintentar ejecutar de nuevo el observable con el método retry()
    // retry() recibe como parámetro la cantidad de intentos que se quiere volver a intentar ejecutar el observable
    /*this.retornaObservable().pipe(
      retry(2)
    ).subscribe({
      next: valor => console.log( 'Subs:', valor ), // Nuevo valor emitido por el observable
      error: err => console.warn('Error:', err), // Error emitido por el observable, al emitir un error el observable se termina
      complete: () => console.info('Obs terminado') // Observable completado, cuando es notificado por el mismo observable
    });*/

    this.intervalSubs = this.retornaIntervalo().subscribe( console.log ); // El argumento que recibe del subscribe, lo pasa directamente como parámetro al console.log
  }

  // Cuando se destruye el componente, es buena práctica desuscribirse de los observables porque se siguen ejecutando en segundo plano
  // Y cuando se vuelve abrir el componente crea un segundo observable y así sucesivamente
  // Cuando nadie está suscrito al observable, el observable se finaliza
  // Esto se usa con observables que están constantemente emitiendo valores
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    return interval(500)
      .pipe( // Los operadores van en cadena, es importante ponerlos en el orden adecuado
        map( valor => { // map sirve para transformar la información que recibe el observable. Recibe la información del observable padre, en este caso del observable interval
          return valor + 1; // La información se retorna transformada
        }),
        // Ya que se ejecuta secuencial, el filter recibe el valor del map, ya que está por debajo de este
        filter( valor => ( valor % 2 == 0 ) ? true : false ), // El filter sirve para filtrar valores, en caso de que la evaluación retorne true, deja seguir con el proceso, sino cumple la condición, entonces no emite el valor
        // En los casos en los que el filter retorne false, no se va a ejecutar el take, por lo que no incrementa el conteo de la cantidad de veces que se ha disparado el observable
        // take(10), // El take permite definir cuantas emisiones del observable se necesitan y después de terminar la cantidad, se completa el observable
      );
  }

  retornaObservable(): Observable<number> {
    let i = -1;
    // Como buena práctica, los observables tienen un $ al final a la hora de guardarlos en una variable o propiedad
    return new Observable<number>( observer => { // El observer es el parametro que tiene toda la información del observable, toda la información que fluye sobre él
      const intervalo = setInterval( () => {
        console.log(i);
        i++;
        // next() emite el siguiente valor a todos los subscribe que tiene el observable.
        observer.next(i);
       
        
        if( i === 4 ){
          clearInterval( intervalo ); // Cancelamos el intervalo
          observer.complete(); // El complete() notifica a todos los subscribe, que el proceso se completó
        }

        if( i === 2 ){
          observer.error('i llegó al valor de 2');
        }

      }, 1000);
    });
  }

}
