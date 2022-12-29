import { Cliente } from "./cliente.interface"
import { Hotspot } from "./hotspot.interface"
import { Imagen360 } from "./imagen360.interface"

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

    imagenes: Imagen360[],

    hotspots: Hotspot[]
}