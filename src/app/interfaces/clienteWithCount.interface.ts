export interface ClienteWithCount{
    id: number,
    idx: string,
    nombre: string,
    email: string,
    direccion: string,
    nombreContacto: string,
    telefonosContacto: string,
    estado:string,
    ventasCount: number,
    valorPagos: number,
    cupoPropiedades: number,
    cantidadPropiedades: number,
    cupoFotos: number,
    cantidadFotos: number
};