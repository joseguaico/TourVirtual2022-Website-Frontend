import { AfterViewInit, Component, ElementRef, Host, Input, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { AlertMensajeComponent } from 'src/app/shared/components/alert-mensaje/alert-mensaje.component';
import { BorrarHotspotModalComponent } from '../components/borrar-hotspot-modal/borrar-hotspot-modal.component';

declare let krpanoJS: any;

declare global {
  interface Window { VisorHotspotEdit: any; }
}

window.VisorHotspotEdit = window.VisorHotspotEdit || {};

const baseUrl: string = environment.baseUrl;

@Component({
  selector: 'app-editar-detalle-foto',
  templateUrl: './editar-detalle-foto.component.html',
  styleUrls: ['./editar-detalle-foto.component.css'], 
})
export class EditarDetalleFotoComponent implements OnInit, AfterViewInit {

  @ViewChild(AgregarHotspotModalComponent) modalAgregarHotspot!: AgregarHotspotModalComponent;
  @ViewChild(CambiarFotoModalComponent) modalCambiarFoto!: CambiarFotoModalComponent;
  @ViewChild(AlertMensajeComponent) alertMensaje!: AlertMensajeComponent;
  @ViewChild(BorrarHotspotModalComponent) modalBorrarHotstpot!: BorrarHotspotModalComponent;

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
  mostrarInfoCupo = false;
  textoInfoCupo = '';

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
    public element: ElementRef,
    private ngZone: NgZone) {
    }
 
  ngOnInit(): void {

    window.VisorHotspotEdit.OnHotspotClick = (nameHostpot: string) => {
      // Since this function runs outside Angular's zone, we need to get back inside!
      this.ngZone.run(() => {
        // Put angular code that has to be called on click on the link in the popover here...
        this.onHotspotClickCustomJS(nameHostpot);
      });
    }


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
    this.textoInfoOpciones = '';
    this.mostrarInfoModo = false;
    this.textoBtnCancelar = 'Cancelar';
    this.setTextoInfoCupo();
    this.mostrarInfoCupo = true;
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
    this.eliminarActivo = true;
    this.mostrarInfoCupo = false;
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
    this.mostrarInfoCupo = false;

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
      const ath = this.krpano.get("hotspot['" + this.hotspotTempAdd?.id + "'].ath");
      const atv = this.krpano.get("hotspot['" + this.hotspotTempAdd?.id + "'].atv");
      this.modalAgregarHotspot.mostrarModal(this.codPropiedad, this.codImagen, ath, atv);
    }
  }
  
  //#region KrPano 

  InicializarKrObjects() {
      if (this.imagen360 !== null) {

        // if (this.auxKrPanoCargado){
        //     document.getElementById('pano')!.innerHTML = '';
        // }
        // this.mostrarOverlay = true;

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

    xmlContent += '<action name="onHotspotClickCustom">';
    xmlContent += 'js(VisorHotspotEdit.OnHotspotClick(get(name)));'; 
    
    xmlContent += '</action>';

    if (this.imagen360 !== null && this.imagen360 !== undefined) {
      xmlContent += this.generateXmlScene();
    }

    xmlContent += '</krpano>';

    return xmlContent;
  }

  generateXmlScene() {
    var sceneContent = '<scene name="S' + this.imagen360!.id + '" title="' + this.imagen360!.descripcion + '" onstart="" thumburl="' + this.imagen360!.thumbnailSrc + '" lat="" lng="" heading="">';
    sceneContent += '<view hlookat="3.51" vlookat="1.00" fovtype="MFOV" fov="140" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto" />';
    sceneContent += '<preview url="' + this.imagen360?.previewSrc + '" />';
    sceneContent += '<image>';
    sceneContent += '<sphere url="' +  this.imagen360?.imageSrc + '" />';
    sceneContent += '</image>';
    
    sceneContent += '<style name="tooltip" onover="copy(layer[tooltip].html, tooltip); set(layer[tooltip].visible, true); tween(layer[tooltip].alpha, 1.0, 0.5); ';
    sceneContent += 'asyncloop(hovering, copy(layer[tooltip].x,mouse.stagex); copy(layer[tooltip].y,mouse.stagey); );" ';
    sceneContent += 'onout="tween(layer[tooltip].alpha, 0.0, 0.25, default, set(layer[tooltip].visible,false), copy(layer[tooltip].x,mouse.stagex); copy(layer[tooltip].y,mouse.stagey); );" ';
    sceneContent += '/>';

    sceneContent += '<layer name="tooltip" keep="true" type="text" parent="STAGE" visible="false" alpha="0" enabled="false" align="lefttop" ';
    sceneContent += 'edge="bottom" oy="-2" background="false" backgroundcolor="0xFFFFFF" backgroundalpha="1.0" border="false" bordercolor="0x000000" borderalpha="1.0" ';
    sceneContent += 'borderwidth="1.0" roundedge="0" shadow="0.0" shadowrange="4.0" shadowangle="45" shadowcolor="0x000000" shadowalpha="1.0" ';
    sceneContent += 'textshadow="1" textshadowrange="6.0" textshadowangle="90" textshadowcolor="0x000000" textshadowalpha="1.0" ';
    sceneContent += 'css="text-align:center; color:#FFFFFF; font-family:Arial; font-weight:bold; font-size:14px;" html="" /> ';

    if (this.imagen360!.hotspots != null && this.imagen360!.hotspots.length > 0) {
      for (var i = 0; i < this.imagen360!.hotspots.length; i++) {
        sceneContent += '<hotspot name="H' + this.imagen360!.hotspots[i].id + '" ';
        sceneContent += 'style="tooltip" ';

        if (this.imagen360!.hotspots[i].sceneTo != '') {
          const tituloSceneTo = this.obtenerTituloFoto(this.imagen360!.hotspots[i].sceneTo);
          sceneContent += 'tooltip="' + tituloSceneTo + '" ';
        } else {
          sceneContent += 'tooltip="(sin imagen)" ';
        }
        sceneContent += 'url="assets/krpano/plugins/hs_circle.png" ';
        sceneContent += 'ath="' + this.imagen360!.hotspots[i].ath + '" atv="' + this.imagen360!.hotspots[i].atv + '" ';
        sceneContent += 'onclick="onHotspotClickCustom">';

        sceneContent += '</hotspot>';
      }
    }
    sceneContent += '</scene>';
    return sceneContent;
  }

//#endregion

  onHotspotClickCustomJS(codHotspot: string) {
    if (this.eliminarActivo == true) {
      const tituloSceneTo = this.obtenerTituloFotoFromHotspot(codHotspot);
      this.modalBorrarHotstpot.mostrarModal(codHotspot, this.codImagen, tituloSceneTo);
    }
  }

  //#region Imagenes 360, Thumbnail y preview (para URL sin token)

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

  //#endregion


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
  }

  //#region Obtiene imagen360, thumbnail y preview, sólo si tiene

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

  //#endregion


  obtenerTituloFoto(codScene: string){
    const scene = this.imagenes.find(f => f.id.trim().toLowerCase() === codScene.trim().toLowerCase());

    // for(let i=0; i<this.imagenes.length; i++){
    //   console.log('Scene: ', this.imagenes[i].id.trim().toLowerCase(), 'bucado: ', codScene.trim().toLowerCase());
    // }

    if (scene){
      //console.log('Scene: ', scene);
      return scene.descripcion;
    }
    return "";
  }

  obtenerTituloFotoFromHotspot(codHotspot: string){
    
    let hotspot: Hotspot | undefined = this.imagen360!.hotspots.find(f => f.id.trim().toLowerCase() === codHotspot.substring(1).trim().toLowerCase());

    //console.log("Hostpot entontrado: ",hotspot);

    if (hotspot){
      return this.obtenerTituloFoto(hotspot.sceneTo);
    }
    return '';
  }

  onHotspotCreado(nuevoHotspot: Hotspot){
  
    this.krpano.call("removehotspot(" + this.hotspotTempAdd?.id + ")");
      
    // Agregar nuevo hotspot
    this.krpano.call("addhotspot(H" + nuevoHotspot.id + ")");
    this.krpano.set("hotspot[H" + nuevoHotspot.id + "].url", "assets/krpano/plugins/hs_circle.png");
    this.krpano.set("hotspot[H" + nuevoHotspot.id+ "].ath", nuevoHotspot.ath);
    this.krpano.set("hotspot[H" + nuevoHotspot.id + "].style", "tooltip");
    this.krpano.call("hotspot[H" +nuevoHotspot.id + "].loadStyle('tooltip')");
    this.krpano.set("hotspot[H" + nuevoHotspot.id + "].distorted", false);
    this.krpano.set("hotspot[H" + nuevoHotspot.id + "].atv", nuevoHotspot.atv);
    this.krpano.set("hotspot[H" + nuevoHotspot.id+ "].tooltip", "'" + this.obtenerTituloFoto(nuevoHotspot.sceneTo) + "'");
    this.krpano.set("hotspot[H" + nuevoHotspot.id + "].onclick", "onHotspotClickCustom");

    this.hotspotTempAdd = null;
    this.agregarActivo = false;

    this.agregarHotspotIfNotExists(nuevoHotspot);
    this.setOpcionesDefault();

    this.alertMensaje.mostrarAlert('Enlace creado exitosamente');
  }


  onHotspotBorrado(hotspotBorrado: Hotspot){
  
    this.krpano.call("removehotspot(h" + hotspotBorrado.id + ")");
    this.removerHotspotIfNotExists(hotspotBorrado);
    this.eliminarActivo = false;

    this.setOpcionesDefault();

    this.alertMensaje.mostrarAlert('Enlace borrado exitosamente');
  }

  setTextoInfoCupo() {
    const hotsCount = this.imagen360!.hotspots.length;
    this.textoInfoCupo = `Esta imagen tiene ${hotsCount} enlaces.`;
  }

  agregarHotspotIfNotExists(hotspotAgregar: Hotspot){
    if(hotspotAgregar.id.toLowerCase().startsWith('h')){
      hotspotAgregar.id = hotspotAgregar.id.substring(1).trim();
    }

    const hotspot: Hotspot | undefined = this.imagen360!.hotspots.find(f => f.id.trim().toLowerCase() === hotspotAgregar.id.trim().toLowerCase());

    if (hotspot === null || hotspot === undefined){
      this.imagen360?.hotspots.push(hotspotAgregar);
    }

    //console.log('Hotspots despues de agregar: ', this.imagen360?.hotspots);
  }

  removerHotspotIfNotExists(hotspotBorrar: Hotspot){
    if(hotspotBorrar.id.toLowerCase().startsWith('h')){
      hotspotBorrar.id = hotspotBorrar.id.substring(1).trim();
    }
    this.imagen360!.hotspots = this.imagen360!.hotspots.filter(f => f.id.trim().toLowerCase() !== hotspotBorrar.id.trim().toLowerCase());

    //console.log('Hotspots despues de borrar: ', this.imagen360?.hotspots);
  }
}
