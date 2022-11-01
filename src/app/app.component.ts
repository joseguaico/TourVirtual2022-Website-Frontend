import { Component, OnDestroy } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'TourVirtualWebApp';

  constructor(private storage: StorageService){}

  ngOnDestroy(): void {
    this.storage.limpiarDatos();
  }

}
