import { ClienteWithCount } from "./clienteWithCount.interface";

export interface DescargaClientesWithCount{
    message: string,
    error: boolean,
    datos: ClienteWithCount[],
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