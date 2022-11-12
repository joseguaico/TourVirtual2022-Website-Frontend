import { Usuario } from "../models/usuario.class";
import { PropiedadTitulo } from "./propiedadTitulo.interface";

export interface DescargaUsuarios{
    message: string,
    error: boolean,
    datos: Usuario[],
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number
}