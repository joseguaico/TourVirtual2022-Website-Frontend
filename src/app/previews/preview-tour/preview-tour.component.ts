import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Imagen360Publicada } from 'src/app/interfaces/imagen360Publicada.interface';
import { PreviewTour } from 'src/app/interfaces/preview-tour.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { AccountService } from 'src/app/services/account.service';
import { PreviewService } from 'src/app/services/preview.service';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

declare let krpanoJS: any;

@Component({
  selector: 'app-preview-tour',
  templateUrl: './preview-tour.component.html',
  styleUrls: ['./preview-tour.component.css']
})
export class PreviewTourComponent implements OnInit {

  public previewTour: PreviewTour | null = null;
  public cargando: boolean = true;
  codigoPropiedad: string = '';
  
  krpano: any = null;
  scenes: any = null;

  mostrarMensajeCarga = false;
  mensajeCarga = '';
  mostrarDetalle = false;

  constructor(private previewService: PreviewService,
    private route: ActivatedRoute,
    public accountService: AccountService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: any) => {
      this.codigoPropiedad = params.get("propiedad")

      //console.log('Codigo propiedad: ', this.codigoPropiedad);

      if(this.codigoPropiedad !== undefined && this.codigoPropiedad !== ''){
        this.obtenerPreviewTour();
      }else{
        this.cargando = false;
        this.mensajeCarga = 'El enlace de la propiedad no es válido';
        this.mostrarMensajeCarga = true;
      }
    })


  }

  obtenerPreviewTour(){
    this.previewService.obtenerPreviewTour(this.codigoPropiedad.trim()).
    subscribe((resp: GeneralResponse) => {

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';
        this.mostrarMensajeCarga = false;

        this.previewTour = resp.datos as PreviewTour;
        
        this.InicializarKrObjects();
        this.cargando = false;

      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        this.mostrarMensajeCarga = true;
        this.cargando = false;
      }

    }, (err) => {
      console.warn("ERR: ", err);
      this.cargando = false;
      this.mostrarDetalle = false;
      this.mensajeCarga = 'Se produjo un error en la comunicación con el servidor';
      this.mostrarMensajeCarga = true;
      
    });
  }

    //#region KrPano 

    InicializarKrObjects() {
      if (this.previewTour!.imagenes !== null) {

      var settings: any = {};
      settings["onstart"] = "loadxml('" + this.getXmlString() + "')";

      krpanoJS.embedpano({
        id: 'current_pano',
        target: document.getElementById('pano') ,//"pano",
        xml: "",
        consolelog: true,
        passQueryParameters: true,
       // onready: this.krpano_onready_callback,
        onready:(krpanoObj :any) => {
          this.krpano = krpanoObj; //krpanoObj.get("global");
          this.scenes = this.krpano.get("scene");
          this.krpano!.get("scene").isDynArray = true;
          //this.auxKrPanoCargado = true;
          //this.mostrarOverlay = false;
        },
        vars: settings
      });
    

     
    }
  }

  getXmlString() {
    // console.log("ongetXmlString");

    var xmlContent = '<krpano title="' + this.previewTour!.titulo + '">';
    
    xmlContent += '<include url="assets/krpano/tours/skin/vtourskin.xml" />';

    xmlContent += '<style name="roomspot" alpha="0.0" capture="false" />';
    xmlContent += '<action name="goto">';
    xmlContent += 'skin_loadscene(%1, OPENBLEND(0.8, 0.0, 0.6, 0.3, easeOutQuad));';
    xmlContent += '</action>';

    xmlContent += '<include url="assets/krpano/tours/loadingProgress/loadinganimation.xml" />';
 
    xmlContent += '<skin_settings maps="false" ' +
    'maps_type="google" ' +
    'maps_bing_api_key="" ' +
    'maps_google_api_key="" ' +
    'maps_zoombuttons="false" ' +
    'maps_loadonfirstuse="true" ' +
    'gyro="false" ' +
    'gyro_keeplookingdirection="false" ' +
    'webvr="true" ' +
    'webvr_keeplookingdirection="true" ' +
    'webvr_prev_next_hotspots="true" ' +
    'autotour="true" ' +
    'littleplanetintro="false" ' +
    'followmousecontrol="false" ' +
    'title="true" ' +
    'thumbs="true" ' +
    'thumbs_width="120" thumbs_height="80" thumbs_padding="10" thumbs_crop="0|40|240|160" ' +
    'thumbs_opened="false" ' +
    'thumbs_text="true" ' +
    'thumbs_dragging="true" ' +
    'thumbs_onhoverscrolling="false" ' +
    'thumbs_scrollbuttons="false" ' +
    'thumbs_scrollindicator="false" ' +
    'thumbs_loop="false" ' +
    'tooltips_buttons="false" ' +
    'tooltips_thumbs="false" ' +
    'tooltips_hotspots="false" ' +
    'tooltips_mapspots="false" ' +
    'deeplinking="false" ' +
    'loadscene_flags="MERGE|KEEPVIEW" ' +
    'loadscene_blend="OPENBLEND(0.5, 0.0, 0.75, 0.05, linear)" ' +
    'loadscene_blend_prev="SLIDEBLEND(0.5, 180, 0.75, linear)" ' +
    'loadscene_blend_next="SLIDEBLEND(0.5,   0, 0.75, linear)" ' +
    'loadingtext="" ' +
    'layout_width="100%" ' +
    'layout_maxwidth="814" ' +
    'controlbar_width="-24" ' +
    'controlbar_height="40" ' +
    'controlbar_offset="20" ' +
    'controlbar_offset_closed="-40" ' +
    'controlbar_overlap.no-fractionalscaling="10" ' +
    'controlbar_overlap.fractionalscaling="0" ' +
    'design_skin_images="vtourskin.png" ' +
    'design_bgcolor="0x2D3E50" ' +
    'design_bgalpha="0.8" ' +
    'design_bgborder="0" ' +
    'design_bgroundedge="1" ' +
    'design_bgshadow="0 4 10 0x000000 0.3" ' +
    'design_thumbborder_bgborder="3 0xFFFFFF 1.0" ' +
    'design_thumbborder_padding="2" ' +
    'design_thumbborder_bgroundedge="0" ' +
    'design_text_css="color:#FFFFFF; font-family:Arial;" ' +
    'design_text_shadow="1" ' +
    '/>';

    xmlContent += '<action name="startup" autorun="onstart">';
    xmlContent += 'if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[0].name); );';
    xmlContent += 'loadscene(get(startscene), null, MERGE);';
    xmlContent += 'if(startactions !== null, startactions() );';

    xmlContent += '</action>';

    if (this.previewTour!.imagenes !== null && this.previewTour!.imagenes !== undefined) {
      for(let i=0; i<this.previewTour!.imagenes.length; i++){
        //console.log("Procesando imagen/escena " + (i + 1));
        xmlContent += this.generateXmlScene(this.previewTour!.imagenes[i]);
      }
    }

    xmlContent += '</krpano>';

    //console.log('XML Content: ', xmlContent );

    return xmlContent;
  }

  generateXmlScene(imagen360: Imagen360Publicada) {
    var sceneContent = '<scene name="S' + imagen360!.id + '" title="' + imagen360!.descripcion + '" onstart="" thumburl="' + this.generarUrlThumbnail(imagen360?.id) + '" lat="" lng="" heading="">';
    sceneContent += '<view hlookat="3.51" vlookat="1.00" fovtype="MFOV" fov="140" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto" />';
    sceneContent += '<preview url="' + this.generarUrlPreview(imagen360?.id) + '" />';
    sceneContent += '<image>';
    sceneContent += '<sphere url="' +  this.generarUrlImagen(imagen360?.id) + '" />';
    sceneContent += '</image>';

    if (imagen360.hotspots != null && imagen360.hotspots.length > 0) {
      for (var i = 0; i < imagen360.hotspots.length; i++) {
        sceneContent += '<hotspot name="H' + imagen360.hotspots[i].id + '" ';
        //sceneContent += 'style="roomspot|skin_tooltips" tooltip="get:scene[' + scene.Hotspots[i].SceneTo + '].title" ';

        sceneContent += 'url="assets/krpano/plugins/hs_circle.png" ';
        sceneContent += 'ath="' + imagen360.hotspots[i].ath + '" atv="' + imagen360.hotspots[i].atv + '" ';
        sceneContent += 'style="skin_tooltips" ';

        if (imagen360.hotspots[i].sceneTo != '') {
          sceneContent += 'tooltip="get:scene[S' + imagen360.hotspots[i].sceneTo + '].title" ';
          sceneContent += 'onclick="goto(S' + imagen360.hotspots[i].sceneTo + ');"> '
        } else {
          sceneContent += 'tooltip="(sin imagen)" >';
        }

        //console.log("scene.Hotspots[i].SceneTo: " + scene.Hotspots[i].SceneTo);
        sceneContent += '</hotspot>';
      }
    }
    sceneContent += '</scene>';
    //console.log('SCENE: ', sceneContent);
    return sceneContent;
  }

//#endregion

  generarUrlImagen(idImagen: string){
    const emailBase64 =  btoa(this.accountService.usuario?.email);
    return `${baseUrl}/Imagenes/reserved/bkt/GetImagen/${idImagen}/${emailBase64}`;
  }
  
  generarUrlPreview(idImagen: string){
    const emailBase64 =  btoa(this.accountService.usuario?.email);
    return `${baseUrl}/Imagenes/reserved/bkt/GetPreview/${idImagen}/${emailBase64}`;
  }

  generarUrlThumbnail(idImagen: string){
    const emailBase64 =  btoa(this.accountService.usuario?.email);
    return `${baseUrl}/Imagenes/reserved/bkt/GetThumbnail/${idImagen}/${emailBase64}`;
  }

  obtenerTituloFoto(codScene: string){
    const scene = this.previewTour!.imagenes.find(f => f.id.trim().toLowerCase() === codScene.trim().toLowerCase());

    if (scene){
      return scene.descripcion;
    }
    return "";
  }
  
  // callback function that will be called when krpano is embedded and ready for using
  krpano_onready_callback(krpano_interface:any) {
    this.krpano = krpano_interface;
    this.scenes = this.krpano.get("scene");
    this.krpano!.get("scene").isDynArray = true;
    console.log('krpano_onready_callback', krpano_interface);
  }
  
}
