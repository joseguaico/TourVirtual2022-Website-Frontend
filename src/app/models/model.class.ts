export class Usuario {

    constructor(
        public uid: string,
        public email: string,
        public nombres: string,
        public apellidos: string,
        public bloqueado: boolean,
        public rol: 'ADMINISTRADOR' | 'CORREDOR',
    ){}


    get nombreFull() : string{
        if(this.nombres!) {
            return this.nombres! + ' ' + this.apellidos!;
        }
        return '';
    }
   
}