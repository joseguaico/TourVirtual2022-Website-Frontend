export class RecuperarPasswordResponse{
   constructor(
      public tieneError: boolean,
      public message: string,
      public datos: object,
      public tokenExpirado: boolean,
   ){}
};