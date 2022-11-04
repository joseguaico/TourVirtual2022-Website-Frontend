import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleMenuService {

  constructor() { }

  public toggleIconClicked: Subject<string> = new Subject(); 
}
