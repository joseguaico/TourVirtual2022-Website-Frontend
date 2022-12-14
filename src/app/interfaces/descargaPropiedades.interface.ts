import { PropiedadTitulo } from "./propiedadTitulo.interface";

export interface DescargaPropiedades{
    message: string,
    error: boolean,
    datos: PropiedadTitulo[],
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    totalRecords: number,

    showPagination: boolean,
    showFirst: boolean,
    showPrevious: boolean,
    showNext: boolean,
    showLast: boolean,
}