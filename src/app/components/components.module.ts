import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    DonaComponent
  ],
  exports: [
    IncrementadorComponent,
    DonaComponent // Se exporta para que pueda usarse fuera, en otro módulo
  ],
  imports: [
    CommonModule,
    FormsModule, //No importa que se importe varias veces, angular solo lo carga 1 vez
    NgChartsModule
  ]
})
export class ComponentsModule { }
