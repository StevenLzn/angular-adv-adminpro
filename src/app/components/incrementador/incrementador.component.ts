import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @Input('progressValue') progress: number = 25;
  @Input() btnClass: string = 'btn-primary'

  @Output('progressValue') valorSalida: EventEmitter<number> = new EventEmitter();


  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }


  cambiarValor( valor: number ) {
    if( this.progress >= 100 && valor >= 0 ){
      this.valorSalida.emit(100);
      this.progress = 100;
      return;
    }

    if( this.progress <= 0 && valor < 0 ){
      this.valorSalida.emit(0);
      this.progress = 0;
      return;
    }

    this.progress += valor;
    this.valorSalida.emit(this.progress);
  }

  onChange( newValue: number ) {
    
    if( newValue >= 100 ){
      this.progress = 100;
    } else if( newValue <= 0) {
      this.progress = 0;
    } else {
      this.progress = newValue;
    }

    this.valorSalida.emit( this.progress );

    //this.valorSalida.emit( newValue );
  }

}
