import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string = '';
  public tituloSubs$!: Subscription;

  constructor( private router: Router, private route: ActivatedRoute ) {

    console.log(route.snapshot.children[0].data); // Otra opción para obtener la data que viene en la ruta, pero no se dispara al cambiar entre componentes, es mejor con el observable(como está abajo)
    
    this.tituloSubs$ = this.getArgumentosRuta().subscribe( ({ titulo }) => {
      this.titulo = titulo;
      document.title = `AdminPro - ${titulo}`;
    });
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe(); // Es necesario desuscribirse por si el usuario se deslogea y vuelve a logearse y nunca refresca el navegador, podrían generarse más observables
  }

  getArgumentosRuta() {
    return this.router.events.pipe(
      filter( (event: any )=> event instanceof ActivationEnd), // Filtramos para que solo pasen los objetos que sean de clase ActivationEnd, el resto los ignora
      filter( (event: ActivationEnd) => event.snapshot.firstChild == null ), // Volvemos a filtrar para que solo pase el que tiene la propiedad de firstChild en null, ese objeto es el que tiene almacenada la data
      map( (event: ActivationEnd) => event.snapshot.data ) // uso el map para obtener solo el valor de data
    )
  }

}
