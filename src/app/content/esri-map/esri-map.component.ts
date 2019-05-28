/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {
  loadModules
} from 'esri-loader';
import {
  ComponentsCommsService
} from '../../components-comms.service';
import esri = __esri; // Esri TypeScript Types
import {
  HttpRequestsService
} from 'src/app/http-requests.service';
import {
  url
} from '../../../assets/js/variables';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit, OnDestroy {

  @Output() mapLoadedEvent = new EventEmitter < boolean > ();

  // The <div> where we will place the map
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array < number > = [0.1278, 51.5074];
  private _basemap = 'streets';
  private _loaded = false;
  private _siteMarker: Array < number > = [0.1278, 51.5074];
  public subscripcionStatus;
  datos;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array < number > ) {
    this._center = center;
  }

  get center(): Array < number > {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Input()
  set siteMarker(siteMarker: Array < number > ) {
    this._siteMarker = siteMarker;
  }

  get siteMarker(): Array < number > {
    return this._siteMarker;
  }

  constructor(private componentsComms: ComponentsCommsService, private httpRequests: HttpRequestsService) {}


  prepareSitePoint() {
    let pointMap = {
      type: "point",
      longitude: this._siteMarker[0],
      latitude: this._siteMarker[1]
    }
    let markerSymbol = {
      type: "picture-marker",
      url: "src/assets/images/grayLocationIcon.png",
      width: '64px',
      height: '64px'
    }
    return [pointMap, markerSymbol];
  }

  setCoordenadasEspecialista(info){
    this.httpRequests.postData(url + '/api/updateCoords', JSON.stringify(info));
  }

  async initializeMap() {
    
    try {

      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, Graphic, Locate] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        "esri/widgets/Locate"
      ]);

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
        ui: {
          components: ["attribution"]
        }
      };
      console.log("Done loading modules");
      let view = new EsriMapView(mapViewProperties);
      let markerParams = this.prepareSitePoint();
      view.graphics.add(
        new Graphic({
          geometry: markerParams[0],
          symbol: markerParams[1]
        })
      );

      let boton = new Locate({
        view: view
      });

      view.ui.add(boton, "top-left");
      this.subscripcionStatus = this.componentsComms.start.subscribe(empezar => {
        if (empezar.split("-")[0] == 'true') {
          var locate = new Locate({
            view: view
          });
          
          view.when( () => {
            locate.locate();
            locate.on("locate", (event) => {
              let lat=event.position.coords.latitude;
              let long=event.position.coords.longitude;
              let coords = String(long+","+lat);
              this.datos = {'Coords': coords,
                'IdAsignacion': parseInt(empezar.split("-")[1]) 
              };
              this.setCoordenadasEspecialista(this.datos);
            })
          });         
        }
      
      });


      return view;

    } catch (error) {
      console.log('EsriLoader: ', error);
    }

  }

  // Finalize a few things once the MapView has been loaded
  houseKeeping(mapView) {
    console.log("Got into house keeping");
    mapView.when(() => {
      console.log('mapView ready: ', mapView.ready);
      this._loaded = mapView.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then((mapView) => {
      this.houseKeeping(mapView);
    });
  }
  ngOnDestroy() {
    this.subscripcionStatus.unsubscribe();
  }

}
