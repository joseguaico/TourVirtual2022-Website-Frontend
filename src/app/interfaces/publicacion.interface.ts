import { Cliente } from "./cliente.interface"
import { Imagen360Publicada } from "./imagen360Publicada.interface"

export interface Publicacion{
    codigo: string,
    titulo: string,
    descripcion: string,
    direccion: string,
    banos: number,
    habitaciones: number,
    region: string,
    comuna: string

    cliente: Cliente,

    imagenes: Imagen360Publicada[],
}