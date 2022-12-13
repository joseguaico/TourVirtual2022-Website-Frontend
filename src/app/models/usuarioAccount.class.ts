export class UsuarioAccount {

    constructor(
        public uid: string,
        public email: string,
        public nombres: string,
        public apellidos: string,
        public bloqueado: boolean,
        public rol: 'ADMINISTRADOR' | 'CORREDOR',
        public empresa: string
    ){}


    get nombreFull() : string{
        console.log('onGetNombre FULL')
        return this.nombres + ' ' + this.apellidos!;
    }
   
}