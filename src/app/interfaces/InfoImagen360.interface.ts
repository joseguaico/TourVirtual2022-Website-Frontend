import { Hotspot } from "./hotspot.interface"

export interface InfoImagen360 {
    id: string,
    descripcion: string,
    hlookat: string,
    vlookat: string,
    fov: string,
    hotspots: Hotspot[],

    imageSrc: any
}