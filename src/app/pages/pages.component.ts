import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFunctions(): void; // Se declara esta función que está en un archivo aparte de js

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( private settingsService: SettingsService ) { }

  ngOnInit(): void {
    customInitFunctions();
  }

}
