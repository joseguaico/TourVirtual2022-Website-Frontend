import { Cliente } from "./cliente.interface";

export interface PropiedadInfo{
    uidx: string,
    codigo: string,
    titulo: string,
    descripcion: string,
    direccion: string,
    banos: number,
    habitaciones: number,
    region: string,
    comuna: string,
    estado: string,
    codEstado: number,
    fotos: number,
    visitas: number,
    cliente: Cliente,
    linkPublicacion: string | null
}