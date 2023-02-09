import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      title: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', url: '/' },
        { title: 'ProgressBar', url: 'progress' },
        { title: 'Gráficas', url: 'grafica1' },
        { title: 'Promesas', url: 'promesas' },
        { title: 'rxjs', url:'rxjs' },
      ]
    },
    {
      title: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { title: 'Usuarios', url: 'usuarios' },
        { title: 'Hospitales', url: 'hospitales' },
        { title: 'Médicos', url: 'medicos' },
      ]
    }
  ]

  constructor() { }
}
