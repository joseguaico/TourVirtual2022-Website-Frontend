import { PropiedadTitulo } from "./propiedadTitulo.interface";
import { Usuario } from "./usuario.interface";

export interface DescargaUsuarios{
    message: string,
    error: boolean,
    datos: Usuario[],
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number
}