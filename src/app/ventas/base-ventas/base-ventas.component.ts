import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-ventas',
  templateUrl: './base-ventas.component.html',
  styleUrls: ['./base-ventas.component.css']
})
export class BaseVentasComponent implements OnInit {

  constructor() {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
  }

}
