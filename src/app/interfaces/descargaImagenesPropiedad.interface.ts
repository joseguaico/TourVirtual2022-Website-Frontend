import { Imagen360 } from "./imagen360.interface";

export interface DescargaImagensPropiedad{
    codPropiedad: string,
    cupoFotos: number,
    usoFotos: number,
    cantidadFotosPropiedad: number,
    imagenes: Imagen360[] 
};