import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private elementTheme = document.querySelector('#theme');

  constructor() {
    const actualTheme = localStorage.getItem('theme') || './assets/css/colors/default.css';
    this.elementTheme?.setAttribute('href', actualTheme);
  }

  
  changeTheme( theme: string ) {

    const url = `./assets/css/colors/${theme}.css`;

    this.elementTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url );
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    // Se recomienda no usar estos saltos al DOM cuando sean muchos elementos.
    // Procurar ponerlo en un alto nivel como una propiedad de la clase y no dentro de un método
    const themes: NodeListOf<Element> = document.querySelectorAll('.selector');

    themes.forEach( elem => {
      elem.classList.remove('working'); // Sirve para remover una clase de un elemento
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.elementTheme?.getAttribute('href');

      if( btnThemeUrl === currentTheme ) {
        elem.classList.add('working')
      }
    });
  }

}
