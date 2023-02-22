import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';


// Es mejor agrupar los pipes en un módulo específico de pipes
// Esto para no importarlos uno por uno en el módulo que se requieran y se vea muy cargado con tantas líneas de importaciones
@NgModule({
  declarations: [ImagenPipe],
  exports: [ImagenPipe],
})
export class PipesModule { }
