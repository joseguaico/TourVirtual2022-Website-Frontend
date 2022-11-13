export class GeneralResponse{
   constructor(
      public tieneError: boolean,
      public message: string,
      public datos: object
   ){}
};