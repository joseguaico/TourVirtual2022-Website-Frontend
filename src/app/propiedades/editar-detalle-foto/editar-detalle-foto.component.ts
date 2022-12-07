import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, mergeMap } from 'rxjs';
import { InfoImagen360 } from 'src/app/interfaces/InfoImagen360.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';
import { environment } from 'src/environments/environment';
import { Hotspot } from 'src/app/interfaces/hotspot.interface';
import { AgregarHotspotModalComponent } from '../components/agregar-hotspot-modal/agregar-hotspot-modal.component';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { CambiarFotoModalComponent } from '../components/cambiar-foto-modal/cambiar-foto-modal.component';

declare let krpanoJS: any;

const baseUrl: string = environment.baseUrl;

@Component({
  selector: 'app-editar-detalle-foto',
  templateUrl: './editar-detalle-foto.component.html',
  styleUrls: ['./editar-detalle-foto.component.css']
})
export class EditarDetalleFotoComponent implements OnInit, AfterViewInit {

  @ViewChild(AgregarHotspotModalComponent) modalAgregarHotspot!: AgregarHotspotModalComponent;
  @ViewChild(CambiarFotoModalComponent) modalCambiarFoto!: CambiarFotoModalComponent;

  @ViewChild('pano', { static : true }) pano!:ElementRef; 

  imagenes: Imagen360[] = [];

  cargando = true;
  mostrarOverlay = false;

  btnAddHotspotVisible = false;
  btnRemoverHotspotVisible = false;
  btnAjustarVisible = false;
  btnOtraImagenVisible = false;
  btnVolverVisible = false;
  btnCancelarVisible = false;
  btnAceptarVisible = false;
  textoBtnCancelar = 'Cancelar';

  codPropiedad: string = '';
  codImagen: string = '';
  imagen360: InfoImagen360 | null = null;
  mostrarDetalle = false;
  tituloImagen = '';
  mensajeCarga = '';

  mostrarInfoModo = false;
  textoModo = 'Modo agregar enlace activado';
  textoInfoOpciones = '';
  cssClassTextoInfo = 'blue';

  agregarActivo = false;
  eliminarActivo = false;

  hotspotTempAdd: Hotspot | null = null;

  scenes: any = null;
  krpano: any;
  auxKrPanoCargado = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagenes360Service: Imagenes360Service,
    private sanitizer: DomSanitizer,
    public element: ElementRef
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.codPropiedad = params.propiedad;
      this.codImagen = params.foto;

      this.cargando = true;

      if(this.codPropiedad !== undefined && this.codPropiedad !== '' && this.codImagen !== undefined && this.codImagen !== ''){
       this.obtenerImagenes360();
       this.obtenerInfoFoto360();
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar las fotos no es válido.";
      }

    });
  }

  ngAfterViewInit(): void {
   
  }


  obtenerInfoFoto360(){
    this.imagenes360Service.obtenerInfoImagen(this.codImagen, this.codPropiedad).subscribe((resp: GeneralResponse) => {

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.imagen360 = resp.datos as InfoImagen360;
        this.setOpcionesDefault();
        this.prepararImagenes().subscribe((res:any) => {
          this.InicializarKrObjects();
          this.cargando = false;
        });
        
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        this.cargando = false;
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  
  obtenerImagenes360(){
    this.imagenes360Service.obtenerImagenesPorPropiedad(this.codPropiedad).subscribe((resp: any) => {
      if(!resp.tieneError){
        this.imagenes = resp.datos.imagenes as Imagen360[];
      }else{
        this.imagenes = [];
      }
    }, (err) => {
      console.warn("ERR: ", err);
    });
  }

  setOpcionesDefault(){
    this.btnAddHotspotVisible = true;
    this.btnRemoverHotspotVisible = true;
    this.btnVolverVisible = true;
    this.btnCancelarVisible = false;
    this.btnAceptarVisible = false;
    this.btnOtraImagenVisible = true;
    this.textoModo = '';
    this.mostrarInfoModo = false;
    this.textoBtnCancelar = 'Cancelar';
  }
  setModoEliminarHotspot(){
    this.btnAddHotspotVisible = false;
    this.btnRemoverHotspotVisible = false;
    this.btnOtraImagenVisible = false;
    this.btnVolverVisible = false;

    this.btnCancelarVisible = true;
    this.btnAceptarVisible = false;

    this.textoBtnCancelar = 'Finalizar';

    this.textoModo = 'Modo borrar enlace activado'; // TODO: Cambiar estilo .removeClass("blue").addClass("red");    
    this.cssClassTextoInfo = 'red';
    this.textoInfoOpciones = 'Haga click sobre el enlace que desea eliminar';
    this.mostrarInfoModo = true;

  }
  setModoAgregarHotspot(){
    this.btnAddHotspotVisible = false;
    this.btnRemoverHotspotVisible = false;
    this.btnOtraImagenVisible = false;
    this.btnVolverVisible = false;
    this.btnCancelarVisible = true;
    this.btnAceptarVisible = true;
    this.textoBtnCancelar = "Cancelar";

    this.textoModo = "Modo agregar enlace activado";
    this.cssClassTextoInfo = "blue";
    this.textoInfoOpciones = "Arrastre el enlace color naranjo hasta la posición deseada.";
    this.mostrarInfoModo = true;

    //$("#spnTextoAccion").text("Modo agregar enlace activado").removeClass("red").addClass("blue");
    //$("#spnInfo").text("Arrastre el enlace color naranjo hasta la posición deseada.");
    //$("#rowInfoAccion").css("display", "");
  }


  mostrarBoton(boton: ElementRef, mostrar: boolean){
    boton!.nativeElement.style.display = mostrar ? '' : 'none';
  }

  btnAgregarHotspotClick(){

    if (this.agregarActivo == false) {
      //resetInfoAlert();
      this.setModoAgregarHotspot();
      this.addHotspotTemporal();
    }
  }
  btnRemoverHotspotClick(){
    if (this.eliminarActivo === false) {
      //TODO: REVIOSAR resetInfoAlert();
      this.setModoEliminarHotspot();
  }

  }
  btnAjustarClick(){

  }
  btnOtraImagenClick(){
    this.modalCambiarFoto.mostrarModal(this.codImagen);
  }
  btnVolverClick(){
    //this.router.navigate([".."]);
    this.router.navigate(['propiedades/editar-fotos'],  { queryParams: { cod: this.codPropiedad} })
  }
  btnCancelarClick(){
    if (this.agregarActivo === true) {
      this.krpano.call("removehotspot(" + this.hotspotTempAdd?.id + ")");
      this.hotspotTempAdd = null;
      this.agregarActivo = false;
  }
  if (this.eliminarActivo == true) {
      this.eliminarActivo = false;
  }
    this.setOpcionesDefault();
  }
  btnAceptarClick(){
    if (this.agregarActivo === true) {

      // var currentScene = $("#aux_imageEdit").val();
      // $("#opt_" + currentScene).hide();

      //$("#ddlScenes").val("-1");
      //TODO:  setModalAgregarHotspot();
      this.modalAgregarHotspot.mostrarModal(this.codPropiedad, this.codImagen);
    }

  }
  
  InicializarKrObjects() {
      if (this.imagen360 !== null) {

      var settings: any = {};
      settings["onstart"] = "loadxml('" + this.getXmlString() + "')";

      krpanoJS.embedpano({
        id: 'current_pano',
        target: document.getElementById('pano') ,//"pano",
        xml: "",
        consolelog: true,
        passQueryParameters: true,
        //onready: this.krpano_onready_callback,
        onready:(krpanoObj :any) => {
          this.krpano = krpanoObj; //krpanoObj.get("global");
          this.scenes = this.krpano.get("scene");
          this.krpano!.get("scene").isDynArray = true;
          this.auxKrPanoCargado = true;
          this.mostrarOverlay = false;
        },
        vars: settings
      });
    

     
    }
  }

  getXmlString() {
    // console.log("ongetXmlString");

    var xmlContent = '<krpano>';
    
    xmlContent += '<include url="assets/krpano/tours/loadingProgress/loadinganimation.xml" />';
    
    xmlContent += '<action name="startup" autorun="onstart">';
    xmlContent += 'if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[0].name); );';
    xmlContent += 'loadscene(get(startscene), null, MERGE);';
    xmlContent += 'if(startactions !== null, startactions() );';
    xmlContent += '</action>';

    xmlContent += '<action name="draghotspot">';
    xmlContent += 'spheretoscreen(ath, atv, hotspotcenterx, hotspotcentery, calc(mouse.stagex LT stagewidth/2 ? "l" : "r"));';
    xmlContent += 'sub(drag_adjustx, mouse.stagex, hotspotcenterx);';
    xmlContent += 'sub(drag_adjusty, mouse.stagey, hotspotcentery); ';
    xmlContent += 'asyncloop(pressed,';
    xmlContent += 'sub(dx, mouse.stagex, drag_adjustx);';
    xmlContent += 'sub(dy, mouse.stagey, drag_adjusty);';
    xmlContent += 'screentosphere(dx, dy, ath, atv);';
    xmlContent += 'print_hotspot_pos();';
    xmlContent += '); ';
    xmlContent += '</action>';

    if (this.imagen360 !== null && this.imagen360 !== undefined) {
      xmlContent += this.generateXmlScene();
    }

    xmlContent += '</krpano>';

    return xmlContent;
  }

  generateXmlScene() {
    //var sceneContent = '<scene name="S' + this.imagen360!.id + '" title="' + this.imagen360!.descripcion + '" onstart="" thumburl="' + this.generarUrlThumbnail() + '" lat="" lng="" heading="">';
    var sceneContent = '<scene name="S' + this.imagen360!.id + '" title="' + this.imagen360!.descripcion + '" onstart="" thumburl="' + this.imagen360!.thumbnailSrc + '" lat="" lng="" heading="">';
    sceneContent += '<view hlookat="3.51" vlookat="1.00" fovtype="MFOV" fov="140" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto" />';
    //sceneContent += '<preview url="' + this.generarUrlPreview() + '" />';
    sceneContent += '<preview url="' + this.imagen360?.previewSrc + '" />';
    sceneContent += '<image>';
    //sceneContent += '<sphere url="' +  this.generarUrlImagen() + '" />';
    sceneContent += '<sphere url="' +  this.imagen360?.imageSrc + '" />';
    sceneContent += '</image>';

    //console.log(sceneContent);

    // console.log("scene.UrlPreview: " + scene.UrlPreview);

    if (this.imagen360!.hotspots != null && this.imagen360!.hotspots.length > 0) {
      for (var i = 0; i < this.imagen360!.hotspots.length; i++) {
        sceneContent += '<hotspot name="H' + this.imagen360!.hotspots[i].id + '" ';
        //sceneContent += 'style="roomspot|skin_tooltips" tooltip="get:scene[' + scene.Hotspots[i].SceneTo + '].title" ';

        sceneContent += 'url="assets/krpano/plugins/hs_circle.png" ';
        sceneContent += 'ath="' + this.imagen360!.hotspots[i].ath + '" atv="' + this.imagen360!.hotspots[i].atv + '" ';
        sceneContent += 'style="skin_tooltips" ';

        if (this.imagen360!.hotspots[i].sceneTo != '') {
          sceneContent += 'tooltip="get:scene[S' + this.imagen360!.hotspots[i].sceneTo + '].title" ';
          sceneContent += 'onclick="goto(S' + this.imagen360!.hotspots[i].sceneTo + ');"> '
        } else {
          sceneContent += 'tooltip="(sin imagen)" >';
        }

        //console.log("scene.Hotspots[i].SceneTo: " + scene.Hotspots[i].SceneTo);
        sceneContent += '</hotspot>';
      }
    }
    sceneContent += '</scene>';
    //console.log("generateXmlScene: " + sceneContent);
    return sceneContent;
  }

  prepareImageThumbnail() {
    return this.imagenes360Service.obtenerThumbnail(this.imagen360!.id).pipe(
      mergeMap(async (response: Blob) => {
        this.imagen360!.thumbnailSrc = await this.CreateImageFromBlob(response);
     }))
  }
  prepareImage360() {
    return this.imagenes360Service.obtenerImagen360(this.imagen360!.id).pipe(
      mergeMap(async (response: Blob) => {
        this.imagen360!.imageSrc = await this.CreateImageFromBlob(response);
     }))
  }
  preparePreview() {
    return this.imagenes360Service.obtenerPreview(this.imagen360!.id).pipe(
      mergeMap(async (response: Blob) => {
        this.imagen360!.previewSrc = await this.CreateImageFromBlob(response);
     }))
  }

  CreateImageFromBlob(image: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      } else {
        reject();
      }
    });
  }

  prepararImagenes(){
    return forkJoin([this.prepareImage360(), this.prepareImageThumbnail(), this.preparePreview()])
  }


  addHotspotTemporal() {
   
    if (this.krpano && this.agregarActivo == false) {
        var h = this.krpano.get("view.hlookat");
        var v = this.krpano.get("view.vlookat");
        var hs_name = "hs_" + ((Date.now() + Math.random()) | 0);	// create unique/randome name

        this.hotspotTempAdd = null;
        this.hotspotTempAdd =  {
          id: hs_name,
          descripcion: '',
          ath: h,
          atv: v,
          sceneTo: ''
        };

        this.krpano.call("addhotspot(" + hs_name + ")");
        this.krpano.set("hotspot[" + hs_name + "].url", "assets/krpano/plugins/hs_circle_orange.png");
        this.krpano.set("hotspot[" + hs_name + "].ath", h);
        this.krpano.set("hotspot[" + hs_name + "].tooltip", "Hotspot to...");
        this.krpano.set("hotspot[" + hs_name + "].atv", v);
        this.krpano.set("hotspot[" + hs_name + "].distorted", true);
        this.krpano.set("hotspot[" + hs_name + "].style", "roomspot|skin_tooltips");
        this.krpano.set("hotspot[" + hs_name + "].ondown", "draghotspot();");

        if (this.krpano.get("device.html5")) {
            // for HTML5 it's possible to assign JS functions directly to krpano events
            this.krpano.set("hotspot[" + hs_name + "].onclick", function (hs:any) {
                // alert('hotspot "' + hs + '" clicked');

               //s console.log("On hotspots click: " + hs_name);

            }.bind(null, hs_name));

            this.agregarActivo = true;
            //mostrarPanelGuardar(true);
        }
        //else {
        //    // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
        //    krpano.set("hotspot[" + hs_name + "].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );");
        //}
    }else{
      console.log('ELSEEE');
    }
  }



  cambiarOtraFoto(codFotoCambiar: string){

    //console.log('Padre cambiarOtraFoto', codFotoCambiar);
    this.codImagen = codFotoCambiar;
    this.cargando = true;

    if(this.codPropiedad !== undefined && this.codPropiedad !== '' && this.codImagen !== undefined && this.codImagen !== ''){

      if (this.auxKrPanoCargado){
        document.getElementById('pano')!.innerHTML = '';
      }
      this.mostrarOverlay = true;


     this.obtenerImagenes360();
     this.obtenerInfoFoto360();
    }else{
      this.mostrarDetalle = false;
      this.mensajeCarga = "El enlace para editar las fotos no es válido.";
    }
  
    //this.router.navigate([`propiedades/editar-detalle-foto?foto=${this.codImagen}&propiedad=${this.codPropiedad}`])
    //this.router.navigate(['propiedades/editar-detalle-foto'],  { queryParams: { foto: this.codImagen, propiedad: this.codPropiedad} })
    

  }


  /* // FUNCIONA SÓLO SI LAS URLS SON PÚBLICAS
  generarUrlImagen(){
    return `${baseUrl}/FotosPropiedades/bkt/GetImagen360/${this.imagen360?.id}`;
  }

  generarUrlPreview(){
    return `${baseUrl}/FotosPropiedades/bkt/GetPreview/${this.imagen360?.id}`;
  }

  generarUrlThumbnail(){
    return `${baseUrl}/FotosPropiedades/bkt/GetThumbnail/${this.imagen360?.id}`;
  }
*/

}
