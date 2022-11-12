import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-account',
  templateUrl: './base-account.component.html',
  styleUrls: ['./base-account.component.css']
})
export class BaseAccountComponent implements OnInit {

  constructor() {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
  }
}
