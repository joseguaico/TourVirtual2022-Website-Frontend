import { Venta } from "./venta.interface";

export interface DescargaVentas{
    message: string,
    error: boolean,
    datos: Venta[],
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