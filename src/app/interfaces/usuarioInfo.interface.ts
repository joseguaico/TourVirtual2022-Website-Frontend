import { Cliente } from "./cliente.interface";
import { Rol } from "./rol.interface";

export interface UsuarioInfo{
    uid: string,
    email: string,
    nombres: string,
    apellidos: string,
    estado: string,
    rol: Rol,
    cliente: Cliente,
}