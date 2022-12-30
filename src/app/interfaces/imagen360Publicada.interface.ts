import { Hotspot } from "./hotspot.interface";

export interface Imagen360Publicada {
    id: string,
    descripcion: string,
    hlookat: string,
    vlookat: string,
    fov: string,

    hotspots: Hotspot[]
}