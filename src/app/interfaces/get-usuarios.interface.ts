import { Usuario } from '../models/usuario.model';
export interface GetUsuario {
    total: number;
    usuarios: Usuario[];
}